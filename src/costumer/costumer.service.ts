import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Costumer } from './entities/costumer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCostumerDTO } from './dto/create-costumer.dto';
import { UpdateCostumerDTO } from './dto/update-costumer.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class CostumerService {
  constructor(
    @InjectRepository(Costumer)
    private costumerRepository: Repository<Costumer>,
  ) {}

  async findAll(): Promise<Costumer[]> {
    return await this.costumerRepository.find();
  }

  async findByID(id: number): Promise<Costumer> {
    const costumerSearch = await this.costumerRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!costumerSearch) {
      throw new HttpException(
        `Costumer with id "${id}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return costumerSearch;
  }

  async create(dto: CreateCostumerDTO): Promise<Costumer> {
    const costumer = this.costumerRepository.create(dto);

    return await this.costumerRepository.save(costumer);
  }

  async update(id: number, dto: UpdateCostumerDTO): Promise<Costumer> {
    const costumer = await this.findByID(id);

    Object.assign(costumer, dto);
    return await this.costumerRepository.save(costumer);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.costumerRepository.delete(id);
  }
}
