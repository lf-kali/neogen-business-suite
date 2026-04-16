import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { BrandBaseService } from "./brand-base.service";
import { PortableDeviceBrand } from "../entities/portable-device-brand.entity";
import { UpdateDeviceBrandDTO } from "../dto/update-device-brand.dto";
import { CreateDeviceBrandDTO } from "../dto/create-device-brand.dto";

export abstract class BrandBaseController<T extends PortableDeviceBrand> {
    constructor(protected service: BrandBaseService<T>){}

    @Get('/all')
    findAll(): Promise<T[]> {
        return this.service.findAll();
    }

    @Get('/id/:id')
    findByID(@Param('id', ParseIntPipe) id: number): Promise<T> {
        return this.service.findByID(id);
    }

    @Get('/name/:name')
    findByName(@Param('name') name: string): Promise<T[]> {
        return this.service.findByName(name);
    }

    @Post('/new')
    create(@Body() dto: CreateDeviceBrandDTO ): Promise<T> {
        return this.service.create(dto);
    }

    @Patch('/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDeviceBrandDTO,
    ): Promise<T> {
        return this.service.update(id, dto);
    }

    @Delete('/delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}