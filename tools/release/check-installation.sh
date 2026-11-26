set -euo pipefail

if [[ $# != 7 ]]; then
  echo 'Pass exact OpenAPI, TypeScript SDK, CLI, MCP, Python, Go, and Rust versions.' >&2
  exit 2
fi
for version in "$@"; do
  [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || exit 2
done
export HIMRING_API_URL="${HIMRING_API_URL:-https://api.himring.ai}"
probes="$(cd "$(dirname "$0")/installed" && pwd)"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
cd "$scratch"
npm install --ignore-scripts --no-audit --no-fund --save-exact "@himring/openapi@$1" "@himring/sdk@$2" "@himring/cli@$3" "@himring/mcp-server@$4"
node "$probes/node.mjs"
uv run --isolated --no-project --with "himring==$5" python "$probes/python.py"
mkdir go
(
  cd go
  go mod init example.org/release-check
  cp "$probes/go-probe.txt" main.go
  go get "github.com/himringhq/himring-sdk/sdks/go@v$6"
  go run .
)
cargo new --quiet --vcs none --name release-check rust
(
  cd rust
  cargo add "himring@=$7"
  cargo add tokio --features rt,macros
  cp "$probes/rust-probe.txt" src/main.rs
  cargo run --quiet
)
printf 'Verified OpenAPI %s, TypeScript %s, CLI %s, MCP %s, Python %s, Go %s, and Rust %s.\n' "$@"
