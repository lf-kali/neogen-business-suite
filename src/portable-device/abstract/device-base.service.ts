import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { PortableDeviceBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { PortableDeviceModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { PortableDevice } from "../entities/portable-device.entity";
import { BrandBaseService } from "../../portable-device-brand/abstract/brand-base.service";
import { ModelBaseService } from "../../portable-device-model/model-base.service";
import { ServiceOrderService } from "../../service-order/service-order.service";
import { CreatePortableDeviceDTO } from "../dto/create-portable-device.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdatePortableDeviceDTO } from "../dto/update-portable-device.dto";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export abstract class PortableDeviceBaseService <
    TDevice extends PortableDevice,
    TBrand extends PortableDeviceBrand,
    TModel extends PortableDeviceModel,
> {
    constructor(
        protected deviceRepo: Repository<TDevice>,
        protected brandService: BrandBaseService<TBrand>,
        protected modelService: ModelBaseService<TModel, TBrand>,
        protected serviceOrderService: ServiceOrderService,
    ){}

    protected abstract buildEntity(
        dto: CreatePortableDeviceDTO,
        brand: TBrand,
        model: TModel,
    ): TDevice;

    async findAll(): Promise<TDevice[]> {
        return this.deviceRepo.find({
            relations: ['brand', 'model', 'serviceOrder'],
        });
    }

    async findByID(id: number): Promise<TDevice> {
        const device = await this.deviceRepo.findOne({
            where: {
                id
            } as unknown as FindOptionsWhere<TDevice>,
        });
        if(!device) {
            throw new HttpException(
                `Device with id "${id}" not found!`,
                HttpStatus.NOT_FOUND,
            );
        }

        return device;
    }

    async create(dto: CreatePortableDeviceDTO): Promise<TDevice> {
        const brand = await this.brandService.findByID(dto.brandId);
        const model = await this.modelService.findById(dto.modelId);

        const device = this.buildEntity(dto, brand, model);

        if (dto.serviceOrderId) {
            device.serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
        }

        return this.deviceRepo.save(device);
    }

    async update(id: number, dto: UpdatePortableDeviceDTO): Promise<TDevice> {
        const device = await this.findByID(id);

        if (dto.brandId) {
            device.brand = await this.brandService.findByID(dto.brandId);
        }

        if (dto.modelId) {
            device.model = await this.modelService.findById(dto.modelId);
        }
        if (dto.serviceOrderId) {
            device.serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
        }

        const {brandId, modelId, serviceOrderId, ...rest} = dto;

        Object.assign(device, rest);

        return this.deviceRepo.save(device);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return this.deviceRepo.delete(id);
    }
}