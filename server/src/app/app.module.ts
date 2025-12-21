import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceOrderModule } from '../service-order/service-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from '../service-order/entities/service-order.entity';
import { TechnicianModule } from '../technician/technician.module';
import { Technician } from '../technician/entities/technician.entity';
import { AuthModule } from '../auth/auth.module';
import { PublicDataModule } from '../public-data/public-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_neogen_business_suite',
      entities: [ServiceOrder, Technician],
      synchronize: true,
    }),
    ServiceOrderModule,
    TechnicianModule,
    AuthModule,
    PublicDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
