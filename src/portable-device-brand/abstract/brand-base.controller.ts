import { Body, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { BrandBaseService } from "./brand-base.service";
import { PortableDeviceBrand } from "../entities/portable-device-brand.entity";
import { UpdateDeviceBrandDTO } from "../dto/update-device-brand.dto";
import { CreateDeviceBrandDTO } from "../dto/create-device-brand.dto";
import { ApiQuery } from "@nestjs/swagger";

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
    @ApiQuery({name: 'returnBrandOnExisting', required: false, type: Boolean})
    create(
        @Query('returnBrandOnExisting', new DefaultValuePipe(false), ParseBoolPipe) returnBrandOnExisting: boolean,
        @Body() dto: CreateDeviceBrandDTO
    ): Promise<T> {
        return this.service.create(dto, returnBrandOnExisting);
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