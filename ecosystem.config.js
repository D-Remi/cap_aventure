// PM2 — Gestionnaire de processus Node.js
// Garde le backend en vie et le relance automatiquement
module.exports = {
  apps: [{
    name:         'capaventure-api',
    script:       'backend/dist/main.js',
    cwd:          '/var/www/capaventure',
    instances:    1,
    autorestart:  true,
    watch:        false,
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'production',
      PORT:     3001,
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file:  '/var/log/pm2/capaventure-error.log',
    out_file:    '/var/log/pm2/capaventure-out.log',
  }],
}
