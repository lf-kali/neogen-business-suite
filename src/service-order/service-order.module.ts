import { forwardRef, Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { TechnicianModule } from '../technician/technician.module';
import { CostumerModule } from '../costumer/costumer.module';
import { DeviceModule } from '../device/device.module';
import { ProductModule } from '../product/product.module';
import { ServiceTypeModule } from '../service-type/service-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrder]), TechnicianModule, CostumerModule, ProductModule, ServiceTypeModule, forwardRef(() => DeviceModule)],
  providers: [ServiceOrderService],
  controllers: [ServiceOrderController],
  exports: [ServiceOrderService],
})
export class ServiceOrderModule {}
