#!/usr/bin/env bash
# Update the demo deploy on the VM: pull, build, restart. Run from anywhere: /opt/edhas/deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

export NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-https://api.edhas.co.in/api}"
export NEXT_TELEMETRY_DISABLED=1

git pull --ff-only origin main
pnpm install --frozen-lockfile

pnpm --filter @edhas/api build
pnpm --filter @edhas/web build

# Next standalone output does not include static assets or public/.
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
cp -r apps/web/public apps/web/.next/standalone/apps/web/public

if sudo pm2 describe edhas-api >/dev/null 2>&1; then
  sudo pm2 restart edhas-api edhas-web
else
  sudo pm2 start ecosystem.config.cjs
fi
sudo pm2 save

sleep 3
curl -fsS http://127.0.0.1:4050/api/health && echo " api ok"
curl -fsSI http://127.0.0.1:3050/login | head -1
