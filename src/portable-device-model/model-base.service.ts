import { DeepPartial, FindOptionsWhere, Like, Repository } from "typeorm";
import { PortableDeviceModel } from "./entities/portable-device-model.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePortableDeviceModelDTO } from "./dto/create-portable-device-model.dto";
import { PortableDeviceBrand } from "../portable-device-brand/entities/portable-device-brand.entity";
import { BrandBaseService } from "../portable-device-brand/abstract/brand-base.service";
import { UpdatePortableDeviceModelDTO } from "./dto/update-device-model.dto";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export abstract class ModelBaseService <
    TModel extends PortableDeviceModel,
    TBrand extends PortableDeviceBrand
> {
    constructor(
        protected modelRepo: Repository<TModel>,
        protected brandService: BrandBaseService<TBrand>
    ){}

    findAll(): Promise<TModel[]> {
        return this.modelRepo.find({
            relations: ['brand', 'devices'],
        });
    }

    async findById(id: number): Promise<TModel> {
        const modelSearch = await this.modelRepo.findOne({
            where: {
                id: id,
            } as FindOptionsWhere<TModel>,
            relations: ['brand', 'devices'],
        });
        if (!modelSearch) {
            throw new HttpException(
                `Device Model with id $"${id}" not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return modelSearch;
    }

    async findByName(name: string): Promise<TModel[]> {
        const brandSearch = await this.modelRepo.find({
            where: {
                name: Like(name),
            } as FindOptionsWhere<TModel>,
            relations: ['devices', 'brand',],
        });

        if(!brandSearch) {
            throw new HttpException(
                `Device Brand with name "${name}" not found!`,
                HttpStatus.NOT_FOUND,
            );
        }
        return brandSearch;
    }

    async doesModelExist(name: string, brandId: number): Promise<Boolean> {
        const modelSearch = await this.modelRepo.find({
            where: {
                name: Like(name),
            } as FindOptionsWhere<TModel>,
            relations: ['devices', 'brand',],
        });

        if(modelSearch.length > 0 && modelSearch[0].brand.id === brandId) return true

        return false;
    }

    async create(dto: CreatePortableDeviceModelDTO): Promise<TModel> {
        const exists = await this.doesModelExist(dto.name, dto.brandId);

        if(exists){
            throw new HttpException(`Dispositivo de nome ${dto.name} já existe na marca de id ${dto.brandId}!`, HttpStatus.NOT_ACCEPTABLE);
        }

        const model = this.modelRepo.create(dto as unknown as DeepPartial<TModel>);
        const brand = await this.brandService.findByID(dto.brandId);

        model.brand = brand;

        return await this.modelRepo.save(model);        
    }

    async update(id: number, dto: UpdatePortableDeviceModelDTO): Promise<TModel> {
        const model = await this.findById(id);

        if (dto.brandId) {
            const brand = await this.brandService.findByID(dto.brandId);
            model.brand = brand;
        }

        const noRelationDto: Omit<UpdatePortableDeviceModelDTO, 'brandId'> = dto;

        Object.assign(model, noRelationDto);
        return await this.modelRepo.save(model);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.modelRepo.delete(id);
    }
}