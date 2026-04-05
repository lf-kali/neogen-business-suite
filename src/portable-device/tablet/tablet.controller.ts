import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PortableDeviceBaseController } from "../device-base.controller";
import { Tablet } from "../entities/portable-device.entity";
import { TabletBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { TabletModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { TabletService } from "./tablet.service";

@UseGuards(JwtAuthGuard)
@ApiTags('Tablet')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/tablets')
export class TabletController extends PortableDeviceBaseController<Tablet, TabletBrand, TabletModel>{
  constructor( tabletService: TabletService) {
    super(tabletService);
  }  
}