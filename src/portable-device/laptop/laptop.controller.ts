import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PortableDeviceBaseController } from "../device-base.controller";
import { Laptop } from "../entities/portable-device.entity";
import { LaptopBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { LaptopModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { LaptopService } from "./laptop.service";

@UseGuards(JwtAuthGuard)
@ApiTags('Laptop')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/laptops')
export class LaptopController extends PortableDeviceBaseController<Laptop, LaptopBrand, LaptopModel>{
  constructor( laptopService: LaptopService) {
    super(laptopService);
  }  
}