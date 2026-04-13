#!/usr/bin/env bash
# Generates a fresh AUTH_SECRET and writes it to .env.local.
# Run manually or hook into your build pipeline.
#
# Usage:
#   ./scripts/generate-auth-secret.sh          # updates .env.local
#   ./scripts/generate-auth-secret.sh --print  # prints without writing

set -euo pipefail

SECRET=$(openssl rand -base64 32)

if [[ "${1:-}" == "--print" ]]; then
  echo "$SECRET"
  exit 0
fi

ENV_FILE="${BASH_SOURCE[0]%/*}/../.env.local"

if [[ -f "$ENV_FILE" ]] && grep -q '^AUTH_SECRET=' "$ENV_FILE"; then
  # Replace existing value
  sed -i.bak "s|^AUTH_SECRET=.*|AUTH_SECRET=$SECRET|" "$ENV_FILE"
  rm -f "$ENV_FILE.bak"
  echo "Updated AUTH_SECRET in $ENV_FILE"
else
  echo "AUTH_SECRET=$SECRET" >> "$ENV_FILE"
  echo "Added AUTH_SECRET to $ENV_FILE"
fi
