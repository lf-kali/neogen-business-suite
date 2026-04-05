import { Injectable } from '@nestjs/common';
import { CellphoneBrand } from '../entities/portable-device-brand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandBaseService } from '../brand-base.service';

@Injectable()
export class CellPhoneBrandService extends BrandBaseService<CellphoneBrand> {
  constructor(
    @InjectRepository(CellphoneBrand)
    repo: Repository<CellphoneBrand>,
  ) {
    super(repo);
  }
}
