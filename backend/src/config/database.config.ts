import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export function dbConfig(): TypeOrmModuleOptions {
  // Railway fournit DATABASE_URL automatiquement pour MySQL
  const url = process.env.DATABASE_URL

  if (url) {
    return {
      type: 'mysql',
      url,
      autoLoadEntities: true,
      // En prod : jamais synchronize:true — utiliser les migrations SQL
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      extra: { connectionLimit: 10 },
    }
  }

  // Fallback : variables séparées (dev local WAMP)
  return {
    type: 'mysql',
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'capaventure',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    extra: { connectionLimit: 10 },
  }
}

export function jwtConfig() {
  return {
    secret:     process.env.JWT_SECRET || 'dev-secret-change-in-prod',
    expiresIn:  process.env.JWT_EXPIRES || '7d',
  }
}
