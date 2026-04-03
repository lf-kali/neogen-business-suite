import { Module } from '@nestjs/common';
import { DeviceBrandService } from './device-brand.service';
import { DeviceBrandController } from './device-brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellphoneBrand, LaptopBrand, PortableDeviceBrand, TabletBrand } from './entities/device-brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortableDeviceBrand, CellphoneBrand, TabletBrand, LaptopBrand,])],
  providers: [DeviceBrandService],
  controllers: [DeviceBrandController],
  exports: [DeviceBrandService],
})
export class DeviceBrandModule {}
