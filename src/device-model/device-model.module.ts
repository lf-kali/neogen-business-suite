import { Module } from '@nestjs/common';
import { DeviceModelService } from './device-model.service';
import { DeviceModelController } from './device-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModel } from './entities/device-model.entity';
import { DeviceBrandModule } from '../device-brand/device-brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceModel]), DeviceBrandModule],
  providers: [DeviceModelService],
  controllers: [DeviceModelController],
  exports: [DeviceModelService],
})
export class DeviceModelModule {}
