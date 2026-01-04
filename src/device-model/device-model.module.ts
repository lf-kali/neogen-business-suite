import { Module } from '@nestjs/common';
import { DeviceModelService } from './device-model.service';
import { DeviceModelController } from './device-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModel } from './entities/device-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceModel])],
  providers: [DeviceModelService],
  controllers: [DeviceModelController],
  exports: [DeviceModelService],
})
export class DeviceModelModule {}
