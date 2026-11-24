import type { HimringClient, VerifySecondFactorOutput } from '@himring/sdk'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import {
  type CommandContext,
  type ContextFor,
  clientFor,
  credentialFor,
  type RecordExitCode,
  runCommand,
} from './command-context.js'
import { readPassword } from './input-sources.js'
import { checkInput, checkOutput } from './spec-schemas.js'
import { UsageError } from './usage-error.js'

const optionsSchema = v.object({
  email: v.optional(v.string()),
  name: v.optional(v.string()),
  passwordStdin: v.optional(v.boolean(), false),
  code: v.optional(v.string()),
  backupCode: v.optional(v.string()),
})

type AuthOptions = v.InferOutput<typeof optionsSchema>

const AUTH_SUGGESTION = 'Correct the options and try again.'

function required(value: string | undefined, flag: string, example: string): string {
  if (value === undefined || value.length === 0) throw new UsageError(`Pass ${flag}.`, `For example: ${example}`)
  return value
}

function deviceKeyOf(email: string): string {
  return email.trim().toLowerCase()
}

function secondFactorOf(options: AuthOptions): { method: 'totp' | 'backup_code'; code: string } | undefined {
  if (options.code !== undefined && options.backupCode !== undefined) {
    throw new UsageError('Pass --code or --backup-code, not both.', 'Use the code that your authenticator app shows.')
  }
  if (options.code !== undefined) return { method: 'totp', code: options.code }
  if (options.backupCode !== undefined) return { method: 'backup_code', code: options.backupCode }
  return undefined
}

async function saveSession(context: CommandContext, signedIn: VerifySecondFactorOutput) {
  context.protectSecret(signedIn.session_token)
  await context.credentials.update(context.options.apiUrl, current => {
    const { challengeToken: _challenge, ...rest } = current
    return { ...rest, sessionToken: signedIn.session_token }
  })
  return {
    state: 'signed_in',
    account: signedIn.session.account,
    expires_at: signedIn.session.expires_at,
    credentials_file: context.credentials.path,
  }
}

async function verifyWith(
  context: CommandContext,
  challengeToken: string,
  secondFactor: { method: 'totp' | 'backup_code'; code: string },
) {
  context.protectSecret(challengeToken)
  context.protectSecret(secondFactor.code)
  const input = { challenge_token: challengeToken, ...secondFactor }
  checkInput('verify_second_factor', input, AUTH_SUGGESTION)
  const signedIn = await clientFor(context, undefined).verifySecondFactor(input)
  checkOutput('verify_second_factor', signedIn)
  return saveSession(context, signedIn)
}

async function signUp(context: CommandContext, options: AuthOptions) {
  const example = 'himring auth sign-up --email owner@example.com --name "Support lead"'
  const email = required(options.email, '--email', example)
  const name = required(options.name, '--name', example)
  const input = { email, name, password: await readPassword(context, options.passwordStdin) }
  checkInput('sign_up', input, AUTH_SUGGESTION)
  const result = await clientFor(context, undefined).signUp(input)
  checkOutput('sign_up', result)
  return { ...result, next: `himring auth sign-in --email ${result.email} --password-stdin` }
}

async function finishWithChallenge(context: CommandContext, challengeToken: string, options: AuthOptions) {
  const secondFactor = secondFactorOf(options)
  if (secondFactor === undefined) {
    await context.credentials.update(context.options.apiUrl, current => ({ ...current, challengeToken }))
    return { state: 'second_factor_required', next: 'himring auth verify --code <six digits>' }
  }
  return verifyWith(context, challengeToken, secondFactor)
}

async function signIn(context: CommandContext, options: AuthOptions) {
  const email = required(options.email, '--email', 'himring auth sign-in --email owner@example.com --password-stdin')
  const password = await readPassword(context, options.passwordStdin)
  const stored = await context.credentials.read(context.options.apiUrl)
  const deviceKey = deviceKeyOf(email)
  const knownDeviceToken = Object.hasOwn(stored.knownDeviceTokens, deviceKey)
    ? stored.knownDeviceTokens[deviceKey]
    : undefined
  context.protectSecret(knownDeviceToken)
  const input = { email, password, ...(knownDeviceToken === undefined ? {} : { known_device_token: knownDeviceToken }) }
  checkInput('sign_in', input, AUTH_SUGGESTION)
  const step = await clientFor(context, undefined).signIn(input)
  checkOutput('sign_in', step)
  await context.credentials.update(context.options.apiUrl, current => ({
    ...current,
    knownDeviceTokens: { ...current.knownDeviceTokens, [deviceKey]: step.known_device_token },
  }))
  if (step.state === 'second_factor_required') return finishWithChallenge(context, step.challenge_token, options)
  await context.credentials.update(context.options.apiUrl, current => ({
    ...current,
    sessionToken: step.session_token,
  }))
  return {
    state: 'second_factor_setup_required',
    next: 'himring auth second-factor setup --password-stdin',
    credentials_file: context.credentials.path,
  }
}

async function verify(context: CommandContext, options: AuthOptions) {
  const secondFactor = secondFactorOf(options)
  if (secondFactor === undefined) {
    throw new UsageError('Pass --code or --backup-code.', 'For example: himring auth verify --code 123456')
  }
  const { challengeToken } = await context.credentials.read(context.options.apiUrl)
  if (challengeToken === undefined) {
    throw new UsageError('No sign-in waits for a second factor.', 'Run himring auth sign-in first.')
  }
  return verifyWith(context, challengeToken, secondFactor)
}

async function sessionClient(context: CommandContext): Promise<HimringClient> {
  const credential = await credentialFor(context)
  if (credential === undefined) throw new UsageError('You are not signed in.', 'Run himring auth sign-in first.')
  return clientFor(context, credential)
}

async function beginSetup(context: CommandContext, options: AuthOptions) {
  const input = { password: await readPassword(context, options.passwordStdin) }
  checkInput('begin_second_factor_setup', input, AUTH_SUGGESTION)
  const setup = await (await sessionClient(context)).beginSecondFactorSetup(input)
  checkOutput('begin_second_factor_setup', setup)
  return {
    ...setup,
    next: 'Add totp_uri to your authenticator app, keep the backup codes, then run himring auth second-factor confirm --code <six digits>',
  }
}

async function confirmSetup(context: CommandContext, options: AuthOptions) {
  const input = { code: required(options.code, '--code', 'himring auth second-factor confirm --code 123456') }
  context.protectSecret(input.code)
  checkInput('confirm_second_factor_setup', input, AUTH_SUGGESTION)
  const signedIn = await (await sessionClient(context)).confirmSecondFactorSetup(input)
  checkOutput('confirm_second_factor_setup', signedIn)
  return saveSession(context, signedIn)
}

async function signOut(context: CommandContext) {
  const result = await (await sessionClient(context)).signOut({})
  checkOutput('sign_out', result)
  await context.credentials.update(context.options.apiUrl, current => {
    const { sessionToken: _session, challengeToken: _challenge, ...rest } = current
    return rest
  })
  return result
}

type AuthAction = (context: CommandContext, options: AuthOptions) => Promise<unknown>

function addAuthAction(command: Command, action: AuthAction, contextFor: ContextFor, recordExitCode: RecordExitCode) {
  return command.action(async (_options: unknown, invoked: Command) => {
    const context = contextFor(invoked)
    if (context === undefined) return
    recordExitCode(await runCommand(context, () => action(context, v.parse(optionsSchema, invoked.opts()))))
  })
}

function passwordStdin(): Option {
  return new Option('--password-stdin', 'read the password from the first line of stdin, or set HIMRING_PASSWORD')
}

function examples(...lines: string[]): string {
  return `\nExamples:\n${lines.map(line => `  $ ${line}`).join('\n')}`
}

function withSecondFactorCodes(command: Command): Command {
  return command
    .option('--code <digits>', 'the six digits that your authenticator app shows')
    .option('--backup-code <code>', 'one of your backup codes, in place of --code')
}

export function addAuthCommands(program: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  const auth = program.command('auth').description('Sign up, sign in, set up your second factor, and sign out.')
  const add = (command: Command, action: AuthAction) => addAuthAction(command, action, contextFor, recordExitCode)

  add(
    auth
      .command('sign-up')
      .description('Create an account, which waits until a Himring operator approves it.')
      .option('--email <address>', 'your email address')
      .option('--name <name>', 'your name')
      .addOption(passwordStdin())
      .addHelpText(
        'after',
        examples(
          'printf "%s" "$PASSWORD" | himring auth sign-up --email owner@example.com --name "Support lead" --password-stdin',
          'HIMRING_PASSWORD=… himring auth sign-up --email owner@example.com --name "Support lead" --output json',
        ),
      ),
    signUp,
  )
  add(
    withSecondFactorCodes(
      auth
        .command('sign-in')
        .description('Sign in with your password and second factor, and keep the session in the credentials file.')
        .option('--email <address>', 'your email address')
        .addOption(passwordStdin()),
    ).addHelpText(
      'after',
      examples(
        'printf "%s" "$PASSWORD" | himring auth sign-in --email owner@example.com --password-stdin --code 123456',
        'HIMRING_PASSWORD=… himring auth sign-in --email owner@example.com && himring auth verify --code 123456',
      ),
    ),
    signIn,
  )
  add(
    withSecondFactorCodes(
      auth.command('verify').description('Finish a sign-in that waits for your second factor.'),
    ).addHelpText(
      'after',
      examples('himring auth verify --code 123456', 'himring auth verify --backup-code 4f7a-9c2e1b'),
    ),
    verify,
  )
  const secondFactor = auth.command('second-factor').description('Set up the authenticator app for your account.')
  add(
    secondFactor
      .command('setup')
      .description('Start the setup, and receive the authenticator URI and ten backup codes.')
      .addOption(passwordStdin())
      .addHelpText(
        'after',
        examples(
          'printf "%s" "$PASSWORD" | himring auth second-factor setup --password-stdin',
          'HIMRING_PASSWORD=… himring auth second-factor setup --output json',
        ),
      ),
    beginSetup,
  )
  add(
    secondFactor
      .command('confirm')
      .description('Finish the setup with a code from the authenticator app.')
      .option('--code <digits>', 'the six digits that your authenticator app shows')
      .addHelpText(
        'after',
        examples(
          'himring auth second-factor confirm --code 123456',
          'himring auth second-factor confirm --code 123456 --output json',
        ),
      ),
    confirmSetup,
  )
  add(
    auth
      .command('sign-out')
      .description('End the session, and remove it from the credentials file.')
      .addHelpText('after', examples('himring auth sign-out', 'himring auth sign-out --output json')),
    context => signOut(context),
  )
}
