import { Module } from '@nestjs/common';
import { CellphoneModelService } from './cellphone-model.service';
import { CellphoneModelController } from './cellphone-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellphoneModel } from '../entities/portable-device-model.entity';
import { CellphoneBrandModule } from '../../portable-device-brand/cellphone-brand/cellphone-brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([CellphoneModel]), CellphoneBrandModule],
  providers: [CellphoneModelService],
  controllers: [CellphoneModelController],
  exports: [CellphoneModelService],
})
export class CellphoneModelModule {}
