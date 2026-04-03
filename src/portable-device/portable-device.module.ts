import { forwardRef, Module } from '@nestjs/common';
import { PortableDeviceService } from './portable-device.service';
import { PorableDeviceController } from './portable-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortableDevice } from './entities/portable-device.entity';
import { DeviceBrandModule } from '../device-brand/device-brand.module';
import { DeviceModelModule } from '../device-model/device-model.module';
import { ServiceOrderModule } from '../service-order/service-order.module';

@Module({
  imports: [TypeOrmModule.forFeature([PortableDevice]), DeviceBrandModule, DeviceModelModule, forwardRef(() => ServiceOrderModule)],
  providers: [PortableDeviceService],
  controllers: [PorableDeviceController],
  exports: [PortableDeviceService],
})
export class PortableDeviceModule {}
