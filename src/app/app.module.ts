import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceOrderModule } from '../service-order/service-order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianModule } from '../technician/technician.module';
import { AuthModule } from '../auth/auth.module';
import { CostumerModule } from '../costumer/costumer.module';
import { CellphoneModule } from '../portable-device/cellphone/cellphone.module';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from '../data/services/prod.service';
import { DevService } from '../data/services/dev.service';
import { ProductModule } from '../product/product.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ServiceTypeModule } from '../service-type/service-type.module';
import { CellphoneBrandModule } from '../portable-device-brand/cellphone-brand/cellphone-brand.module';
import { CellphoneModelModule } from '../portable-device-model/cellphone-model/cellphone-model.module';

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
    CellphoneModule,
    CellphoneBrandModule,
    CellphoneModelModule,
    ProductModule,
    ProductCategoryModule,
    ServiceTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
