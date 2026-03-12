import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class ProdService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            logging: false,
            ssl: {
                rejectUnauthorized: false,
            },
            synchronize: true,
            autoLoadEntities: true,
        };
    }
}