import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PortableDevice } from "./entities/portable-device.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PortableDeviceSearchService {
    constructor(
        @InjectRepository(PortableDevice)
        private repo: Repository<PortableDevice>
    ) {}

    async findAll(): Promise<PortableDevice[]> {
        return await this.repo.find({
            relations: ['brand', 'model', 'serviceOrder', 'serviceOrder.costumer'],
        });
    }

    async findbyID(id: number): Promise<PortableDevice> {
        const device = await this.repo.findOne({
            where: {
                id,
            },
            relations: ['brand', 'model', 'serviceOrder', 'serviceOrder.costumer'],
        });
        
        if(!device) {
            throw new HttpException(`Dispositivo de id "${id}" não encontrado!`, HttpStatus.NOT_FOUND);
        }

        return device;
    }

}