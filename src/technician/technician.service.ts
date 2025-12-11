import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class TechnicianService {
    constructor (
        @InjectRepository(Technician)
        private technicianRepository: Repository<Technician>,
    ) {}

    async findAll(): Promise<Technician[]> {
        return await this.technicianRepository.find({
            relations: {
                serviceOrders: true,
            },
        })
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
        if(!technicianSearch) {
            throw new HttpException(`Técnico com id ${id} não existe!`, HttpStatus.NOT_FOUND);
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

    async create(technician: Technician): Promise<Technician> {
        return await this.technicianRepository.save(technician);
    }


    async update(technician: Technician): Promise<Technician> {
        await this.findByID(technician.id);
        
        return await this.technicianRepository.save(technician)
    }
}
