import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { BrandBaseController } from "../abstract/brand-base.controller";
import { LaptopBrand } from "../entities/portable-device-brand.entity";
import { LaptopBrandService } from "./laptop-brand.service";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@ApiTags('Laptop Brand')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/laptop-brands')
export class LaptopBrandController extends BrandBaseController<LaptopBrand> {
    constructor(private readonly laptopBrandService: LaptopBrandService){
        super(laptopBrandService);
    }
}