import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceModel } from './entities/device-model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceModelDTO } from './dto/create-device-model.dto';
import { UpdateDeviceModelDTO } from './dto/update-device-model.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class DeviceModelService {
  constructor(
    @InjectRepository(DeviceModel)
    private deviceModelRepository: Repository<DeviceModel>,
  ) {}

  async findAll(): Promise<DeviceModel[]> {
    return await this.deviceModelRepository.find({
      relations: ['brand', 'devices'],
    });
  }

  async findByID(id: number): Promise<DeviceModel> {
    const deviceModelSearch = await this.deviceModelRepository.findOne({
      where: {
        id: id,
      },
      relations: ['brand', 'devices'],
    });
    if (!deviceModelSearch) {
      throw new HttpException(
        `Device Model with id "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return deviceModelSearch;
  }

  async create(dto: CreateDeviceModelDTO): Promise<DeviceModel> {
    const deviceModel = this.deviceModelRepository.create(dto);

    return await this.deviceModelRepository.save(deviceModel);
  }

  async update(id: number, dto: UpdateDeviceModelDTO): Promise<DeviceModel> {
    const deviceModel = await this.findByID(id);

    Object.assign(deviceModel, dto);
    return await this.deviceModelRepository.save(deviceModel);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.deviceModelRepository.delete(id);
  }
}
