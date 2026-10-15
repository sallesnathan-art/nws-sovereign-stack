#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_PATH="$(readlink -f "$0")"
ROOT="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"
ln -sfn "$ROOT/bin/nws" "$BIN_DIR/nws"
chmod +x "$ROOT/bin/nws"

PROFILE="$HOME/.bashrc"
if [ -n "$SHELL" ] && [ "$(basename "$SHELL")" = "zsh" ]; then
  PROFILE="$HOME/.zshrc"
fi
touch "$PROFILE"
if ! grep -Fq '# NWS CLI PATH' "$PROFILE"; then
  printf '\n# NWS CLI PATH\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "$PROFILE"
fi

printf '\nNWS CLI installed.\n'
printf 'Repository: %s\n' "$ROOT"
printf 'Command:    %s/nws\n' "$BIN_DIR"
printf '\nReload your shell, or run:\n  export PATH="$HOME/.local/bin:$PATH"\n'
printf 'Then try: nws help\n'
printf '\nRequirements: Git and Node.js 20+. For local preview, install Python 3.\n'
