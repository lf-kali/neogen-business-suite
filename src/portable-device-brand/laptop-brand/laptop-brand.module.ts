import { TypeOrmModule } from "@nestjs/typeorm";
import { LaptopBrand } from "../entities/portable-device-brand.entity";
import { LaptopBrandController } from "./laptop-brand.controller";
import { LaptopBrandService } from "./laptop-brand.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([LaptopBrand])],
  providers: [LaptopBrandService],
  controllers: [LaptopBrandController],
  exports: [LaptopBrandService],
})
export class LaptopBrandModule {}