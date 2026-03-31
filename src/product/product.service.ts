import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private productCategoryService: ProductCategoryService,
    ){}

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    async findByID(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            relations: ['category'],
            where: {
                id: id,
            },
            
        });

        if(!product) {
            throw new HttpException(`Produto com id ${id} não encontrado!`, HttpStatus.NOT_FOUND)
        }

        return product;
    }

    async create(dto: CreateProductDto): Promise<Product> {
        const product =  this.productRepository.create(dto);

        if (dto.categoryId) {
            const category = await this.productCategoryService.findById(dto.categoryId);
            product.category = category;
        }

        return await this.productRepository.save(product);
    }

    async update(id: number, dto: UpdateProductDTO): Promise<Product> {
        const product = await this.findByID(id);

        if (dto.categoryId) {
            const category = await this.productCategoryService.findById(dto.categoryId);
            product.category = category;
        }

        return await this.productRepository.save(product);
    }

    async delete(id: number): Promise<DeleteResult>{
        return await this.productRepository.delete(id);
    }
}
