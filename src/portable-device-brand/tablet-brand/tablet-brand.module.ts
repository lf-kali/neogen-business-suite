import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TabletBrand } from "../entities/portable-device-brand.entity";
import { TabletBrandService } from "./tablet-brand.service";
import { TabletBrandController } from "./tablet-brand.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TabletBrand])],
  providers: [TabletBrandService],
  controllers: [TabletBrandController],
  exports: [TabletBrandService],
})
export class TabletBrandModule {}