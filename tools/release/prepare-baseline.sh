set -euo pipefail

release_dir="${1:?Pass a temporary directory for the release.}"
mkdir -p "$release_dir/cli" "$release_dir/spec"
version="$(npm view @himring/cli version)"
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
git fetch --depth=1 --no-tags https://github.com/himringhq/himring-sdk.git "refs/tags/cli@v$version"
git archive FETCH_HEAD | tar -x -C "$release_dir/cli"
(
  cd "$release_dir/cli"
  pnpm install --frozen-lockfile
  pnpm exec nx run cli:build
)
spec_version="$(npm view @himring/openapi version)"
[[ "$spec_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
(
  cd "$release_dir/spec"
  archive="$(npm pack --ignore-scripts --silent "@himring/openapi@$spec_version")"
  tar -xzf "$archive" --strip-components=1 package/openapi.json package/openapi-session.json
)
printf 'Released CLI %s and OpenAPI %s\n' "$version" "$spec_version"
