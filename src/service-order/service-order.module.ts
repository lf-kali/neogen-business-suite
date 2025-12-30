import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { TechnicianModule } from '../technician/technician.module';
import { CostumerModule } from '../costumer/costumer.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrder]), TechnicianModule, CostumerModule],
  providers: [ServiceOrderService],
  controllers: [ServiceOrderController],
})
export class ServiceOrderModule {}
