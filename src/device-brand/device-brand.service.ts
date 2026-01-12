import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceBrand } from './entities/device-brand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceBrandDTO } from './dto/create-device-brand.dto';
import { UpdateDeviceBrandDTO } from './dto/update-device-brand.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class DeviceBrandService {
  constructor(
    @InjectRepository(DeviceBrand)
    private deviceBrandRepository: Repository<DeviceBrand>,
  ) {}

  async findAll(): Promise<DeviceBrand[]> {
    return await this.deviceBrandRepository.find({
      relations: ['devices', 'models'],
    });
  }

  async findByID(id: number): Promise<DeviceBrand> {
    const deviceBrandSearch = await this.deviceBrandRepository.findOne({
      where: {
        id: id,
      },
      relations: ['devices', 'models'],
    });
    if (!deviceBrandSearch) {
      throw new HttpException(
        `Device Brand with id "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return deviceBrandSearch;
  }

  async create(dto: CreateDeviceBrandDTO): Promise<DeviceBrand> {
    const deviceBrand = this.deviceBrandRepository.create(dto);

    return await this.deviceBrandRepository.save(deviceBrand);
  }

  async update(id: number, dto: UpdateDeviceBrandDTO): Promise<DeviceBrand> {
    const deviceBrand = await this.findByID(id);

    Object.assign(deviceBrand, dto);
    return await this.deviceBrandRepository.save(deviceBrand);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.deviceBrandRepository.delete(id);
  }
}
