import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CellphoneBrand, LaptopBrand, PortableDeviceBrand, TabletBrand } from './entities/device-brand.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceBrandDTO } from './dto/create-device-brand.dto';
import { UpdateDeviceBrandDTO } from './dto/update-device-brand.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class DeviceBrandService {
  constructor(
    @InjectRepository(PortableDeviceBrand)
    private portableDeviceBrandRepository: Repository<PortableDeviceBrand>,
    @InjectRepository(CellphoneBrand)
    private cellphoneBrandRepository: Repository<CellphoneBrand>,
    @InjectRepository(LaptopBrand)
    private laptopBrandRepository: Repository<LaptopBrand>,
    @InjectRepository(CellphoneBrand)
    private tabletBrandRepository: Repository<TabletBrand>,
  ) {}

  async findAll(): Promise<PortableDeviceBrand[]> {
    return await this.portableDeviceBrandRepository.find({
      relations: ['devices', 'models'],
    });
  }

  async findByID(id: number): Promise<PortableDeviceBrand> {
    const deviceBrandSearch = await this.portableDeviceBrandRepository.findOne({
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

  async findByName(name: string): Promise<PortableDeviceBrand[]> {
    const deviceBrandSearch = await this.portableDeviceBrandRepository.find({
      where: {
        name: Like(name),
      },
      relations:{
        devices: true,
        models: true,
      }
    });
    if (!deviceBrandSearch) {
      throw new HttpException(
        `Device Brand with name "${name}" not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    return deviceBrandSearch;
  }

  async create(dto: CreateDeviceBrandDTO): Promise<PortableDeviceBrand> {
    const deviceBrand = this.portableDeviceBrandRepository.create(dto);

    return await this.portableDeviceBrandRepository.save(deviceBrand);
  }

  async update(id: number, dto: UpdateDeviceBrandDTO): Promise<PortableDeviceBrand> {
    const deviceBrand = await this.findByID(id);

    Object.assign(deviceBrand, dto);
    return await this.portableDeviceBrandRepository.save(deviceBrand);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.portableDeviceBrandRepository.delete(id);
  }
}
