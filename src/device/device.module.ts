import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceBrandModule } from '../device-brand/device-brand.module';
import { DeviceModelModule } from '../device-model/device-model.module';
import { ServiceOrderModule } from '../service-order/service-order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), DeviceBrandModule, DeviceModelModule, forwardRef(() => ServiceOrderModule)],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
