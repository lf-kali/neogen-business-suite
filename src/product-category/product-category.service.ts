import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
    constructor(
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>,
    ){}

    async findAll(): Promise<ProductCategory[]>{
        return await this.productCategoryRepository.find({
            relations: ['products'],
        })
    }

    async findById(id: number): Promise<ProductCategory> {
        const category = await this.productCategoryRepository.findOne({
            where: {
                id: id,
            },
            relations: ['products', 'products.category']
        });

        if (!category) {
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);
        }

        return category;
    }

    async create(dto: CreateProductCategoryDTO): Promise<ProductCategory> {
        return await this.productCategoryRepository.save(dto)
    }

    async update(id: number, dto: UpdateProductCategoryDTO): Promise<ProductCategory> {
        const category = await this.findById(id)
        
        const noRelationDto: Omit<UpdateProductCategoryDTO, 'productIDs'> = dto;

        Object.assign(category, noRelationDto);
        return await this.productCategoryRepository.save(category);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.productCategoryRepository.delete(id)
    }
}
