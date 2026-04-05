import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { LaptopBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { LaptopModel } from "../entities/portable-device-model.entity";
import { ModelBaseController } from "../model-base.controller";
import { LaptopModelService } from "./laptop-model.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiTags('Laptop Model')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/laptop-models')
export class LaptopModelController extends ModelBaseController<LaptopModel, LaptopBrand> {
  constructor( laptopModelService: LaptopModelService) {
    super(laptopModelService);
  }
}