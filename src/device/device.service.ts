import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDTO } from './dto/create-device.dto';
import { UpdateDeviceDTO } from './dto/update-device.dto';
import { DeleteResult } from 'typeorm/browser';
import { DeviceModelService } from '../device-model/device-model.service';
import { DeviceBrand } from '../device-brand/entities/device-brand.entity';
import { DeviceBrandService } from '../device-brand/device-brand.service';
import { DeviceModel } from '../device-model/entities/device-model.entity';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        private deviceBrandService: DeviceBrandService,
        private deviceModelService: DeviceModelService,
    ) {}

    async findAll(): Promise<Device[]> {
        return await this.deviceRepository.find({
            relations: ['brand', 'model', 'initialDiagnosis', 'serviceOrder'],
        });
    }

    async findByID(id: number): Promise<Device> {
        const deviceSearch = await this.deviceRepository.findOne({
            where: {
                id: id,
            },
            relations: ['brand', 'model', 'initialDiagnosis', 'serviceOrder'],
        });
        if (!deviceSearch) {
            throw new HttpException(
                `Device with id "${id}" not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return deviceSearch;
    }

    async create(dto: CreateDeviceDTO): Promise<Device> {
        const brand: DeviceBrand = await this.deviceBrandService.findByID(dto.brandId);
        const model: DeviceModel = await this.deviceModelService.findByID(dto.modelId);
        const device: Device = this.deviceRepository.create(dto);

        device.brand = brand;
        device.model = model;

        return await this.deviceRepository.save(device);
    }

    async update(id: number, dto: UpdateDeviceDTO): Promise<Device> {
        const device = await this.findByID(id);

        if (dto.brandId) {
            const brand = await this.deviceBrandService.findByID(dto.brandId);
            device.brand = brand;
        }

        if (dto.modelId) {
            const model = await this.deviceModelService.findByID(dto.modelId);
            device.model = model;
        }

        const noRelationDto: Omit<UpdateDeviceDTO, 'brandId' | 'modelId'> = dto;

        Object.assign(device, noRelationDto);
        return await this.deviceRepository.save(device);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return await this.deviceRepository.delete(id);
    }
}
