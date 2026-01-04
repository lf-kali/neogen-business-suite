import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDTO } from './dto/create-device.dto';
import { UpdateDeviceDTO } from './dto/update-device.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
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
        const device = this.deviceRepository.create(dto);

        return await this.deviceRepository.save(device);
    }

    async update(id: number, dto: UpdateDeviceDTO): Promise<Device> {
        const device = await this.findByID(id);

        Object.assign(device, dto);
        return await this.deviceRepository.save(device);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return await this.deviceRepository.delete(id);
    }
}
