import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { TechnicianModule } from '../technician/technician.module';
import { PublicDataModule } from '../public-data/public-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrder]),
    TechnicianModule,
    PublicDataModule,
  ],
  providers: [ServiceOrderService],
  controllers: [ServiceOrderController],
})
export class ServiceOrderModule {}
