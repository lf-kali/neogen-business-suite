import { forwardRef, Module } from '@nestjs/common';
import { CellphoneService } from './cellphone.service';
import { CellphoneController } from './cellphone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cellphone } from '../entities/portable-device.entity';
import { ServiceOrderModule } from '../../service-order/service-order.module';
import { CellphoneModelModule } from '../../portable-device-model/cellphone-model/cellphone-model.module';
import { CellphoneBrandModule } from '../../portable-device-brand/cellphone-brand/cellphone-brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cellphone]), CellphoneBrandModule, CellphoneModelModule, forwardRef(() => ServiceOrderModule)],
  providers: [CellphoneService],
  controllers: [CellphoneController],
  exports: [CellphoneService],
})
export class CellphoneModule {}
