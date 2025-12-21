import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { Between, Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { TechnicianService } from '../technician/technician.service';

@Injectable()
export class ServiceOrderService {
  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,
    private technicianService: TechnicianService,
  ) {}

  async findAll(): Promise<ServiceOrder[]> {
    return await this.serviceOrderRepository.find({
      relations: {
        technician: true,
      },
    });
  }

  async findAllByDate(date: string): Promise<ServiceOrder[]> {
    const dateSearch = await this.serviceOrderRepository.find({
      where: {
        entryDate: Between(
          new Date(`${date}T00:00:00.000Z`),
          new Date(`${date}T23:59:59.999Z`),
        ),
      },
      relations: {
        technician: true,
      },
    });
    return dateSearch;
  }

  async findByID(id: number): Promise<ServiceOrder> {
    const serviceOrder = await this.serviceOrderRepository.findOne({
      where: {
        id,
      },
      relations: {
        technician: true,
      },
    });
    if (!serviceOrder) {
      throw new HttpException(
        'Ordem de serviço não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    return serviceOrder;
  }

  async create(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    if (serviceOrder.technician)
      await this.technicianService.findByID(serviceOrder.technician.id);

    return await this.serviceOrderRepository.save(serviceOrder);
  }

  async update(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    await this.findByID(serviceOrder.id);

    if (serviceOrder.technician)
      await this.technicianService.findByID(serviceOrder.technician.id);

    return await this.serviceOrderRepository.save(serviceOrder);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.serviceOrderRepository.delete(id);
  }
}
