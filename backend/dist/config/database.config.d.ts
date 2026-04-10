import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare function dbConfig(): TypeOrmModuleOptions;
export declare function jwtConfig(): {
    secret: string;
    expiresIn: string;
};
