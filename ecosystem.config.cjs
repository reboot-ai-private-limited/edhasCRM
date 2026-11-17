// pm2 process file for the shared demo VM (see docs/deploy-pm2.md).
// Ports: api 4050, web 3050 (other apps on the VM use 3010-3040 / 4010-4040). Both bind to localhost; nginx fronts them.
const root = process.env.EDHAS_ROOT || '/opt/edhas';

module.exports = {
  apps: [
    {
      name: 'edhas-api',
      cwd: `${root}/apps/api`,
      script: 'dist/server.js',
      node_args: '--env-file=.env.prod',
    },
    {
      name: 'edhas-web',
      cwd: `${root}/apps/web/.next/standalone`,
      script: 'apps/web/server.js',
      env: { PORT: 3050, HOSTNAME: '127.0.0.1', NODE_ENV: 'production' },
    },
  ],
};
