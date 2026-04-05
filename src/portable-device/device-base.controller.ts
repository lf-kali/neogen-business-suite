import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PortableDeviceBrand } from "../portable-device-brand/entities/portable-device-brand.entity";
import { PortableDeviceModel } from "../portable-device-model/entities/portable-device-model.entity";
import { PortableDeviceBaseService } from "./device-base.service";
import { PortableDevice } from "./entities/portable-device.entity";
import { CreatePortableDeviceDTO } from "./dto/create-portable-device.dto";
import { UpdatePortableDeviceDTO } from "./dto/update-portable-device.dto";

export abstract class PortableDeviceBaseController<
    TDevice extends PortableDevice,
    TBrand extends PortableDeviceBrand,
    TModel extends PortableDeviceModel,
> {
    constructor (
        protected service: PortableDeviceBaseService<TDevice, TBrand, TModel>
    ){}

    @Get('/all')
    findAll(): Promise<TDevice[]> {
        return this.service.findAll();
    }

    @Get('/id/:id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<TDevice> {
        return this.service.findByID(id);
    }

    @Post('/new')
    create(@Body() dto: CreatePortableDeviceDTO ): Promise<TDevice> {
        return this.service.create(dto);
    }

    @Patch('/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePortableDeviceDTO,
    ): Promise<TDevice> {
        return this.service.update(id, dto);
    }

    @Delete('/delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}