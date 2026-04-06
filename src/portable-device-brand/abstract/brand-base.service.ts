import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PortableDeviceBrand } from "../entities/portable-device-brand.entity";
import { DeepPartial, FindOptionsWhere, Like, Repository } from "typeorm";
import { CreateDeviceBrandDTO } from "../dto/create-device-brand.dto";
import { UpdateDeviceBrandDTO } from "../dto/update-device-brand.dto";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export abstract class BrandBaseService<T extends PortableDeviceBrand> {
    constructor(protected repo: Repository<T>){}

    findAll(): Promise<T[]> {
        return this.repo.find({
            relations: ['devices', 'models'],
        });
    }

    async findByID(id: number): Promise<T> {
        const brandSearch = await this.repo.findOne({
            where: {
                id
            } as FindOptionsWhere<T>,
            relations: ['devices', 'models'],
        });
        if(!brandSearch) {
            throw new HttpException(`Device brand with id "${id}" not found`, HttpStatus.NOT_FOUND);
        }
        return brandSearch;
    }

    async findByName(name: string): Promise<T[]> {
        const brandSearch = await this.repo.find({
            where: {
                name: Like(name),
            } as FindOptionsWhere<T>,
            relations: ['devices', 'models',],
        });

        if(!brandSearch) {
            throw new HttpException(
                `Device Brand with name "${name}" not found!`,
                HttpStatus.NOT_FOUND,
            );
        }
        return brandSearch;
    }

    async create(dto: CreateDeviceBrandDTO): Promise<T> {
        const brand = this.repo.create(dto as DeepPartial<T>);

        return await this.repo.save(brand);
    }

    async update(id: number, dto: UpdateDeviceBrandDTO): Promise<T> {
        const brand = await this.findByID(id);

        Object.assign(brand, dto);
        return await this.repo.save(brand);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return await this.repo.delete(id);
    }
}