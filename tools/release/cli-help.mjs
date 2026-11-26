import { execFileSync } from 'node:child_process'

export function commandsOf(entry) {
  const found = new Map()
  function visit(words) {
    const command = words.join(' ')
    if (found.has(command)) throw new Error(`Duplicate command: ${command}`)
    const help = execFileSync(entry, [...words, '--help'], { encoding: 'utf8', timeout: 20000 })
    const lines = help.split('\n')
    const options = new Set()
    const children = []
    let section = ''
    for (const line of lines) {
      if (/^\S/.test(line)) section = line
      if (section === 'Options:') {
        const flag = /^ {2}(?:-\w, )?(--[\w-]+)(?: (<?[\w-]+>|\[[\w-]+\]))?/.exec(line)
        if (flag) options.add(flag[1] + (flag[2]?.startsWith('<') ? ' value' : flag[2] ? ' optional' : ''))
      }
      if (section === 'Commands:') {
        const child = /^ {2}([a-z][a-z0-9-]*)\b/.exec(line)?.[1]
        if (child && child !== 'help') children.push(child)
      }
    }
    found.set(command, options)
    for (const child of children) visit([...words, child])
  }
  visit([])
  return found
}
