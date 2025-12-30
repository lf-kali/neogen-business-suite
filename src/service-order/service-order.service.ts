import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { Between, Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { TechnicianService } from '../technician/technician.service';
import { CreateServiceOrderDTO } from './dto/create-service-order.dto';
import { CostumerService } from '../costumer/costumer.service';
import { UpdateServiceOrderDto } from './dto/upate-service-order.dto';

@Injectable()
export class ServiceOrderService {
  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,
    private technicianService: TechnicianService,
    private costumerService: CostumerService,
  ) {}

  async findAll(): Promise<ServiceOrder[]> {
    return await this.serviceOrderRepository.find({
      relations: {
        technician: true,
        costumer: true,
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
        costumer: true,
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
        costumer: true,
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

  async create(dto: CreateServiceOrderDTO): Promise<ServiceOrder> {
    const technician = await this.technicianService.findByID(dto.technicianId);
    const costumer = await this.costumerService.findByID(dto.costumerId);

    const serviceOrder = this.serviceOrderRepository.create(dto);
    serviceOrder.technician = technician;
    serviceOrder.costumer = costumer;

    return await this.serviceOrderRepository.save(serviceOrder);
  }

  async update(id: number, dto: UpdateServiceOrderDto): Promise<ServiceOrder> {
    const serviceOrder = await this.findByID(id);

    if (dto.technicianId) {
      const technician = await this.technicianService.findByID(
        dto.technicianId,
      );
      serviceOrder.technician = technician;
    }

    if (dto.costumerId) {
      const costumer = await this.costumerService.findByID(dto.costumerId);
      serviceOrder.costumer = costumer;
    }

    const noRelationDto: Omit<
      UpdateServiceOrderDto,
      'technicianId' | 'costumerId'
    > = dto;

    Object.assign(serviceOrder, noRelationDto);
    return await this.serviceOrderRepository.save(serviceOrder);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.serviceOrderRepository.delete(id);
  }
}
