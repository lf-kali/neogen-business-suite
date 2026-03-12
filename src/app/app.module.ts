import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceOrderModule } from '../service-order/service-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from '../service-order/entities/service-order.entity';
import { TechnicianModule } from '../technician/technician.module';
import { Technician } from '../technician/entities/technician.entity';
import { AuthModule } from '../auth/auth.module';
import { Costumer } from '../costumer/entities/costumer.entity';
import { CostumerModule } from '../costumer/costumer.module';
import { Device } from '../device/entities/device.entity';
import { DeviceBrand } from '../device-brand/entities/device-brand.entity';
import { DeviceModel } from '../device-model/entities/device-model.entity';
import { InitialDiagnosis } from '../device/entities/initial-diagnosis';
import { DeviceModule } from '../device/device.module';
import { DeviceBrandModule } from '../device-brand/device-brand.module';
import { DeviceModelModule } from '../device-model/device-model.module';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from '../data/services/prod.service';
import { DevService } from '../data/services/dev.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DevService,
      imports: [ConfigModule],
    }),
    ServiceOrderModule,
    TechnicianModule,
    AuthModule,
    CostumerModule,
    DeviceModule,
    DeviceBrandModule,
    DeviceModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
