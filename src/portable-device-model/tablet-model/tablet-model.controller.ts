import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { TabletBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { TabletModel } from "../entities/portable-device-model.entity";
import { ModelBaseController } from "../model-base.controller";
import { TabletModelService } from "./tablet-model.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@ApiTags('Tablet Model')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/tablet-models')
export class TabletModelController extends ModelBaseController<TabletModel, TabletBrand> {
  constructor( tabletModelService: TabletModelService) {
    super(tabletModelService);
  }
}