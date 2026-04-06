import { Injectable } from "@nestjs/common";
import { BrandBaseService } from "../abstract/brand-base.service";
import { LaptopBrand } from "../entities/portable-device-brand.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class LaptopBrandService extends BrandBaseService<LaptopBrand> {
    constructor(
        @InjectRepository(LaptopBrand)
        repo: Repository<LaptopBrand>,
    ){
        super(repo);
    }
}