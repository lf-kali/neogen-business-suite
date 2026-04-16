import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceType } from './entities/service-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceTypeDTO } from './dto/create-service-type.dto';
import { UpdateServiceTypeDTO } from './dto/update-service-type.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class ServiceTypeService {
    constructor(
        @InjectRepository(ServiceType)
        private serviceTypeRepository: Repository<ServiceType>
    ){}

    async findAll(): Promise<ServiceType[]> {
        return await this.serviceTypeRepository.find({
            relations: ['serviceOrders', 'serviceOrders.costumer'],
        });
    }

    async findById(id: number): Promise<ServiceType> {
        const serviceType = await this.serviceTypeRepository.findOne({
            where: {
                id: id,
            },
            relations: ['serviceOrders', 'serviceOrders.costumer']
        });
        
        if (!serviceType) {
            throw new HttpException(`Tipo de serviço com id ${id} não encontrado!`, HttpStatus.NOT_FOUND);
        }

        return serviceType;
    } 

    async create(dto: CreateServiceTypeDTO): Promise<ServiceType> {
        return await this.serviceTypeRepository.save(dto);
    }

    async update(id: number, dto: UpdateServiceTypeDTO): Promise<ServiceType> {
        const serviceType = await this.findById(id);

        return await this.serviceTypeRepository.save(dto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.serviceTypeRepository.delete(id);
    }
}
