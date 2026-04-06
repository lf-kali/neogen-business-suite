import {
  ClassSerializerInterceptor,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CellphoneBrand } from '../entities/portable-device-brand.entity';
import { CellPhoneBrandService } from './cellphone-brand.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BrandBaseController } from '../abstract/brand-base.controller';


@UseGuards(JwtAuthGuard)
@ApiTags('Cellphone Brand')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/cellphone-brands')
export class CellphoneBrandController extends BrandBaseController<CellphoneBrand>{
  constructor(private readonly cellphoneBrandService: CellPhoneBrandService) {
    super(cellphoneBrandService);
  }
}
