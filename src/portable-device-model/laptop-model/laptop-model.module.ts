import { Module } from '@nestjs/common';
import { LaptopModelService } from './laptop-model.service';
import { LaptopModelController } from './laptop-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaptopModel } from '../entities/portable-device-model.entity';
import { LaptopBrandModule } from '../../portable-device-brand/laptop-brand/laptop-brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([LaptopModel]), LaptopBrandModule],
  providers: [LaptopModelService],
  controllers: [LaptopModelController],
  exports: [LaptopModelService],
})
export class LaptopModelModule {}
