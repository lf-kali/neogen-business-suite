import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelBaseService } from '../model-base.service';
import { CellphoneBrand } from '../../portable-device-brand/entities/portable-device-brand.entity';
import { CellphoneModel } from '../entities/portable-device-model.entity';
import { CellPhoneBrandService } from '../../portable-device-brand/cellphone-brand/cellphone-brand.service';

@Injectable()
export class CellphoneModelService extends ModelBaseService<CellphoneModel, CellphoneBrand>{
  constructor(
    @InjectRepository(CellphoneModel)
    repo: Repository<CellphoneModel>,
    brandService: CellPhoneBrandService,
  ) {
    super(repo, brandService);
  }

}
