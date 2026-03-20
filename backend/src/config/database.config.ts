import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const dbConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER     || 'capaventure',
  password: process.env.DB_PASS     || 'capaventure',
  database: process.env.DB_NAME     || 'capaventure',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // auto-migrate en dev
  logging: process.env.NODE_ENV === 'development',
})

export const jwtConfig = {
  secret:     process.env.JWT_SECRET || 'capaventure-super-secret-change-in-prod',
  expiresIn:  '7d',
}
