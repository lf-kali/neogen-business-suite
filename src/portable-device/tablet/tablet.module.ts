import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tablet } from "../entities/portable-device.entity";
import { TabletBrandModule } from "../../portable-device-brand/tablet-brand/tablet-brand.module";
import { TabletModelModule } from "../../portable-device-model/tablet-model/tablet-model.module";
import { ServiceOrderModule } from "../../service-order/service-order.module";
import { TabletService } from "./tablet.service";
import { TabletController } from "./tablet.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Tablet]), TabletBrandModule, TabletModelModule, forwardRef(() => ServiceOrderModule)],
  providers: [TabletService],
  controllers: [TabletController],
  exports: [TabletService],
})
export class TabletModule {}
