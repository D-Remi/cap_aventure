"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = dbConfig;
function dbConfig() {
    const url = process.env.DATABASE_URL;
    if (url) {
        return {
            type: 'mysql',
            url,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
            extra: { connectionLimit: 10 },
        };
    }
    return {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'capaventure',
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        extra: { connectionLimit: 10 },
    };
}
//# sourceMappingURL=database.config.js.map