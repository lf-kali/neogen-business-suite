import {
  ClassSerializerInterceptor,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CellphoneModelService } from './cellphone-model.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CellphoneModel } from '../entities/portable-device-model.entity';
import { CellphoneBrand } from '../../portable-device-brand/entities/portable-device-brand.entity';
import { ModelBaseController } from '../model-base.controller';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@ApiTags('Cellphone Model')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/cellphone-models')
export class CellphoneModelController extends ModelBaseController<CellphoneModel, CellphoneBrand> {
  constructor( cellphoneModelService: CellphoneModelService) {
    super(cellphoneModelService);
  }
}
