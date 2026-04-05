import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PortableDeviceBrand } from "../portable-device-brand/entities/portable-device-brand.entity";
import { PortableDeviceModel } from "./entities/portable-device-model.entity";
import { ModelBaseService } from "./model-base.service";
import { CreatePortableDeviceModelDTO } from "./dto/create-portable-device-model.dto";
import { UpdatePortableDeviceModelDTO } from "./dto/update-device-model.dto";

export abstract class ModelBaseController<TModel extends PortableDeviceModel, TBrand extends PortableDeviceBrand> {
    constructor(protected service: ModelBaseService<TModel, TBrand>){}

     @Get('/all')
        findAll(): Promise<TModel[]> {
            return this.service.findAll();
        }
    
        @Get('/id/:id')
        findOne(@Param('id', ParseIntPipe) id: number): Promise<TModel> {
            return this.service.findById(id);
        }
    
        @Post('/new')
        create(@Body() dto: CreatePortableDeviceModelDTO ): Promise<TModel> {
            return this.service.create(dto);
        }
    
        @Patch('/update/:id')
        update(
            @Param('id', ParseIntPipe) id: number,
            @Body() dto: UpdatePortableDeviceModelDTO,
        ): Promise<TModel> {
            return this.service.update(id, dto);
        }
    
        @Delete('/delete/:id')
        delete(@Param('id', ParseIntPipe) id: number) {
            return this.service.delete(id);
        }
}