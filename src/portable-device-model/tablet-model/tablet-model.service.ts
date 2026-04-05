import { Injectable } from "@nestjs/common";
import { ModelBaseService } from "../model-base.service";
import { TabletModel } from "../entities/portable-device-model.entity";
import { TabletBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TabletBrandService } from "../../portable-device-brand/tablet-brand/tablet-brand.service";

@Injectable()
export class TabletModelService extends ModelBaseService<TabletModel, TabletBrand> {
  constructor(
    @InjectRepository(TabletModel)
    repo: Repository<TabletModel>,
    brandService: TabletBrandService
  ) {
    super(repo, brandService);
  }
}