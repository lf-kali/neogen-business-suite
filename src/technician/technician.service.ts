import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { ILike, Repository } from 'typeorm';
import { Bcrypt } from '../auth/bcrypt/bcrypt';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Injectable()
export class TechnicianService {
  constructor(
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    private bcrypt: Bcrypt,
  ) {}

  async findByEmail(email: string): Promise<Technician | null> {
    return await this.technicianRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findAll(): Promise<Technician[]> {
    return await this.technicianRepository.find({
      relations: {
        serviceOrders: true,
      },
    });
  }

  async findByID(id: number): Promise<Technician> {
    const technicianSearch = await this.technicianRepository.findOne({
      where: {
        id,
      },
      relations: {
        serviceOrders: true,
      },
    });
    if (!technicianSearch) {
      throw new HttpException(
        `Técnico com id ${id} não existe!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return technicianSearch;
  }

  async findAllByName(name: string): Promise<Technician[]> {
    return await this.technicianRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: {
        serviceOrders: true,
      },
    });
  }

  async create(dto: CreateTechnicianDto): Promise<Technician> {
    const technicianSearch = await this.findByEmail(dto.email);

    if (technicianSearch)
      throw new HttpException(
        `Técnico com email "${dto.email}" já existe!`,
        HttpStatus.BAD_REQUEST,
      );

    dto.password = await this.bcrypt.encryptPassword(
      dto.password,
    );
    const technician = this.technicianRepository.create(dto)
    return await this.technicianRepository.save(technician);

  }

  async update(id: number, dto: UpdateTechnicianDto): Promise<Technician> {
    const technician = await this.findByID(id);

    if (dto.email) {
      const technicianSearch = await this.findByEmail(dto.email);

      if (technicianSearch && technicianSearch.id !== id)
        throw new HttpException(
          `Técnico com email "${dto.email}" já existe!`,
          HttpStatus.BAD_REQUEST,
        );
    }

    if (dto.password) {
      dto.password = await this.bcrypt.encryptPassword(
        dto.password,
      );
    }

    Object.assign(technician, dto);

    return await this.technicianRepository.save(technician);
  }
}
