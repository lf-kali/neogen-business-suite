import {
  ClassSerializerInterceptor,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CellphoneService } from './cellphone.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PortableDeviceBaseController } from '../abstract/device-base.controller';
import { CellphoneBrand } from '../../portable-device-brand/entities/portable-device-brand.entity';
import { CellphoneModel } from '../../portable-device-model/entities/portable-device-model.entity';
import { Cellphone } from '../entities/portable-device.entity';


@UseGuards(JwtAuthGuard)
@ApiTags('Cellphone')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/cellphones')
export class CellphoneController extends PortableDeviceBaseController<Cellphone, CellphoneBrand, CellphoneModel>{
  constructor( cellphoneService: CellphoneService) {
    super(cellphoneService);
  }  
}
