import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Laptop } from "../entities/portable-device.entity";
import { LaptopBrandModule } from "../../portable-device-brand/laptop-brand/laptop-brand.module";
import { LaptopModelModule } from "../../portable-device-model/laptop-model/laptop-model.module";
import { ServiceOrderModule } from "../../service-order/service-order.module";
import { LaptopService } from "./laptop.service";
import { LaptopController } from "./laptop.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Laptop]), LaptopBrandModule, LaptopModelModule, forwardRef(() => ServiceOrderModule)],
  providers: [LaptopService],
  controllers: [LaptopController],
  exports: [LaptopService],
})
export class LaptopModule {}
