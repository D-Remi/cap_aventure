import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const dbConfig: () => TypeOrmModuleOptions;
export declare const jwtConfig: {
    secret: string;
    expiresIn: string;
};
