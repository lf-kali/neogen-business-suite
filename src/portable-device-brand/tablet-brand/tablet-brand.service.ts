import { Injectable } from "@nestjs/common";
import { BrandBaseService } from "../abstract/brand-base.service";
import { TabletBrand } from "../entities/portable-device-brand.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TabletBrandService extends BrandBaseService<TabletBrand> {
    constructor(
        @InjectRepository(TabletBrand)
        repo: Repository<TabletBrand>,
    ){
        super(repo);
    }
}