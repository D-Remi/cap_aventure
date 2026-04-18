module.exports = {
  apps: [{
    name:        'capaventure-api',
    script:      'backend/dist/main.js',
    cwd:         '/var/www/cap_aventure',
    instances:   1,
    autorestart: true,
    watch:       false,
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'production',
      PORT:     3001,
      DB_HOST: 'localhost',
      DB_PORT: 3306,
      DB_USER: 'capaventure',
      DB_PASS: 'CapAv2024!',
      DB_NAME: 'capaventure',
    },
    error_file: '/var/log/pm2/capaventure-error.log',
    out_file:   '/var/log/pm2/capaventure-out.log',
  }],
}

