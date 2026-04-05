import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellphoneBrand } from '../entities/portable-device-brand.entity';
import { CellPhoneBrandService} from './cellphone-brand.service';
import { CellphoneBrandController } from './cellphone-brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CellphoneBrand])],
  providers: [CellPhoneBrandService],
  controllers: [CellphoneBrandController],
  exports: [CellPhoneBrandService],
})
export class CellphoneBrandModule {}
