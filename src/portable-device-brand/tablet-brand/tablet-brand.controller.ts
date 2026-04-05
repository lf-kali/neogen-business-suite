import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BrandBaseController } from "../brand-base.controller";
import { TabletBrand } from "../entities/portable-device-brand.entity";
import { TabletBrandService } from "./tablet-brand.service";

@UseGuards(JwtAuthGuard)
@ApiTags('Tablet Brand')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/tablet-brands')
export class TabletBrandController extends BrandBaseController<TabletBrand> {
    constructor(private readonly tabletBrandService: TabletBrandService){
        super(tabletBrandService);
    }
}