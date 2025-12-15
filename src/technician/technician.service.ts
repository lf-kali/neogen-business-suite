import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { ILike, Repository } from 'typeorm';
import { Bcrypt } from '../auth/bcrypt/bcrypt';
import { PublicDataService } from '../public-data/public-data.service';

@Injectable()
export class TechnicianService {
  constructor(
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    private bcrypt: Bcrypt,
    private publicDataService: PublicDataService,
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
      select: this.publicDataService.selectPublicData(),
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
      select: this.publicDataService.selectPublicData(),
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
      select: this.publicDataService.selectPublicData(),
      where: {
        name: ILike(`%${name}%`),
      },
      relations: {
        serviceOrders: true,
      },
    });
  }

  async create(technician: Technician): Promise<void> {
    const technicianSearch = await this.findByEmail(technician.email);

    if (technicianSearch)
      throw new HttpException(
        `Técnico com email "${technician.email}" já existe!`,
        HttpStatus.BAD_REQUEST,
      );

    technician.password = await this.bcrypt.encryptPassword(
      technician.password,
    );
    await this.technicianRepository.save(technician);
  }

  async update(technician: Technician): Promise<void> {
    await this.findByID(technician.id);
    const technicianSearch = await this.findByEmail(technician.email);

    if (technicianSearch && technicianSearch.id !== technician.id)
      throw new HttpException(
        `Técnico com email "${technician.email}" já existe!`,
        HttpStatus.BAD_REQUEST,
      );

    technician.password = await this.bcrypt.encryptPassword(
      technician.password,
    );

    await this.technicianRepository.save(technician);
  }
}
