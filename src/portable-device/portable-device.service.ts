import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortableDevice } from './entities/portable-device.entity';
import { Repository } from 'typeorm';
import { CreatePortableDeviceDTO } from './dto/create-portable-device.dto';
import { UpdatePortableDeviceDTO } from './dto/update-portable-device.dto';
import { DeleteResult } from 'typeorm/browser';
import { DeviceModelService } from '../device-model/device-model.service';
import { PortableDeviceBrand } from '../device-brand/entities/device-brand.entity';
import { DeviceBrandService } from '../device-brand/device-brand.service';
import { DeviceModel } from '../device-model/entities/device-model.entity';
import { ServiceOrderService } from '../service-order/service-order.service';

@Injectable()
export class PortableDeviceService {
    constructor(
        @InjectRepository(PortableDevice)
        private portableDeviceRepository: Repository<PortableDevice>,
        private deviceBrandService: DeviceBrandService,
        private deviceModelService: DeviceModelService,
        @Inject(forwardRef(() => ServiceOrderService))
        private serviceOrderService: ServiceOrderService,
    ) {}

    async findAll(): Promise<PortableDevice[]> {
        return await this.portableDeviceRepository.find({
            relations: ['brand', 'model', 'serviceOrder'],
        });
    }
    
    async findByID(id: number): Promise<PortableDevice> {
        const deviceSearch = await this.portableDeviceRepository.findOne({
            where: {
                id: id,
            },
            relations: ['brand', 'model', 'serviceOrder'],
        });
        if (!deviceSearch) {
            throw new HttpException(
                `Device with id "${id}" not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return deviceSearch;
    }

    async create(dto: CreatePortableDeviceDTO): Promise<PortableDevice> {
        const brand: PortableDeviceBrand = await this.deviceBrandService.findByID(dto.brandId);
        const model: DeviceModel = await this.deviceModelService.findByID(dto.modelId);
        const device: PortableDevice = this.portableDeviceRepository.create(dto);

        device.brand = brand;
        device.model = model;

        if (dto.serviceOrderId) {
            const serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
            device.serviceOrder = serviceOrder;
        }

        return await this.portableDeviceRepository.save(device);
    }

    async update(id: number, dto: UpdatePortableDeviceDTO): Promise<PortableDevice> {
        const device = await this.findByID(id);

        if (dto.brandId) {
            const brand = await this.deviceBrandService.findByID(dto.brandId);
            device.brand = brand;
        }

        if (dto.modelId) {
            const model = await this.deviceModelService.findByID(dto.modelId);
            device.model = model;
        }

        if (dto.serviceOrderId) {
            const serviceOrder = await this.serviceOrderService.findByID(dto.serviceOrderId);
            device.serviceOrder = serviceOrder;
        }

        const noRelationDto: Omit<UpdatePortableDeviceDTO, 'brandId' | 'modelId' | 'serviceOrderId'> = dto;

        Object.assign(device, noRelationDto);
        return await this.portableDeviceRepository.save(device);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return await this.portableDeviceRepository.delete(id);
    }
}
