import { Injectable } from "@nestjs/common";
import { LaptopBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { LaptopModel } from "../entities/portable-device-model.entity";
import { ModelBaseService } from "../model-base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LaptopBrandService } from "../../portable-device-brand/laptop-brand/laptop-brand.service";

@Injectable()
export class LaptopModelService extends ModelBaseService<LaptopModel, LaptopBrand> {
  constructor(
    @InjectRepository(LaptopModel)
    repo: Repository<LaptopModel>,
    brandService: LaptopBrandService
  ) {
    super(repo, brandService);
  }
}