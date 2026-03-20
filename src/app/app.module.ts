import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceOrderModule } from '../service-order/service-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianModule } from '../technician/technician.module';
import { AuthModule } from '../auth/auth.module';
import { CostumerModule } from '../costumer/costumer.module';
import { DeviceModule } from '../device/device.module';
import { DeviceBrandModule } from '../device-brand/device-brand.module';
import { DeviceModelModule } from '../device-model/device-model.module';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from '../data/services/prod.service';
import { DevService } from '../data/services/dev.service';
import { ProductModule } from '../product/product.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ServiceTypeModule } from '../service-type/service-type.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
      imports: [ConfigModule],
    }),
    ServiceOrderModule,
    TechnicianModule,
    AuthModule,
    CostumerModule,
    DeviceModule,
    DeviceBrandModule,
    DeviceModelModule,
    ProductModule,
    ProductCategoryModule,
    ServiceTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
