#!/bin/sh
# Source saved credentials if they exist (written by the setup wizard)
if [ -f /app/data/.env ]; then
  . /app/data/.env
fi

# Push the DB schema on first boot (idempotent — no-ops if tables exist)
exec node apps/web/server.js
