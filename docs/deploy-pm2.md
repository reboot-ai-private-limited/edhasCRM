# Deploy to the shared demo VM (pm2 + nginx)

Web: https://demo.edhas.co.in (port 3050) · API: https://api.demo.edhas.co.in (port 4050).
Same VM as greynote / vastu / darjeeling. Not Docker; see `manual_deploy.md` for the Docker route and for the seed/migration scripts.

**Firebase is off by design.** Leave `FIREBASE_SERVICE_ACCOUNT_JSON` out of `.env.prod` entirely (an empty line crashes boot).
The API then sends no push; Inbox still works.

## One-time setup (on the VM)

1. **Prereqs**: Node >= 22; `corepack enable && corepack prepare pnpm@11.18.0 --activate`;
   `sudo ss -ltnp | grep -E ':(3050|4050)\b'` is empty; `free -h` shows ~2 GB free (add swap otherwise).
2. **DNS**: A records for `demo.edhas.co.in` and `api.demo.edhas.co.in` to the VM's public IP.
3. **Deploy key**:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/edhas_deploy -C "edhas-demo-vm-deploy" -N ""
   cat ~/.ssh/edhas_deploy.pub   # GitHub repo -> Settings -> Deploy keys (read-only)
   printf '\nHost github-edhas\n    HostName github.com\n    User git\n    IdentityFile ~/.ssh/edhas_deploy\n    IdentitiesOnly yes\n' >> ~/.ssh/config
   ssh -T git@github-edhas
   ```
4. **Clone**: `sudo mkdir -p /opt/edhas && sudo chown $USER: /opt/edhas && git clone git@github-edhas:reboot-ai-private-limited/edhasCRM.git /opt/edhas`
5. **Atlas**: allowlist the VM IP (`curl -4 ifconfig.me`), create database `edhas-demo` with its own user.
6. **Env**: `cp apps/api/.env.demo.example apps/api/.env.prod && chmod 600 apps/api/.env.prod`, then fill `MONGO_URI` and both JWT secrets.
7. **First build + start**: `cd /opt/edhas && pnpm install --frozen-lockfile && ./deploy.sh`
   (the health check at its end will fail only if the API cannot reach Mongo; run `sudo pm2 logs edhas-api`).
8. **Seed once**: `cd apps/api && node --env-file=.env.prod dist/scripts/seed.js` (prompts for the first Admin).
9. **nginx**: create `/etc/nginx/sites-available/edhas` with the two server blocks below, link it, test, reload, then certbot:
   ```bash
   sudo ln -s /etc/nginx/sites-available/edhas /etc/nginx/sites-enabled/edhas
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d demo.edhas.co.in -d api.demo.edhas.co.in
   ```

```nginx
server {
    server_name demo.edhas.co.in;
    access_log /var/log/nginx/edhas-web.access.log;
    error_log  /var/log/nginx/edhas-web.error.log;
    location / {
        proxy_pass http://127.0.0.1:3050;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout    65s;
    }
}

server {
    server_name api.demo.edhas.co.in;
    access_log /var/log/nginx/edhas-api.access.log;
    error_log  /var/log/nginx/edhas-api.error.log;
    client_max_body_size 10m;
    location / {
        proxy_pass http://127.0.0.1:4050;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        # Overwrite, not append: the API runs trust proxy = 1.
        proxy_set_header X-Forwarded-For   $remote_addr;
        # Required: the refresh cookie is Secure and Express reads this to see HTTPS.
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout    65s;
    }
}
```

## Verify

- `curl -s https://api.demo.edhas.co.in/api/health` returns 200.
- Log in at https://demo.edhas.co.in as the seeded Admin: no CORS error, `gn_refresh` cookie set (Secure, HttpOnly), reload keeps the session.
- `sudo pm2 logs edhas-api --lines 50` has no "Invalid environment". `sudo pm2 ls` still shows the other apps online.

## Updating

`/opt/edhas/deploy.sh` (pull, build, copy static assets, restart, health check).
`NEXT_PUBLIC_API_BASE_URL` is baked in at build time; the script defaults it to the demo API URL.
