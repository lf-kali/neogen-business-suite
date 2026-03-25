import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from './dto/create-product-category.dto';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Product Categories')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('product-category')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService){}

    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<ProductCategory[]> {
        return this.productCategoryService.findAll();
    }

    @Get('/id/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<ProductCategory> {
        return this.productCategoryService.findById(id);
    }

    @Post('/new')
    @HttpCode(HttpStatus.CREATED)
    create( @Body() dto: CreateProductCategoryDTO ): Promise<ProductCategory> {
        return this.productCategoryService.create(dto);
    }

    @Patch('/update/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body()
        dto: UpdateProductCategoryDTO,
    ): Promise<ProductCategory> {
        return this.productCategoryService.update(id, dto);
    }
    
    @Delete('/delete/:id')
    @HttpCode(HttpStatus.OK)
    delete(
        @Param('id')
        id: number,
    ): Promise<DeleteResult> {
        return this.productCategoryService.delete(id);
    }

}
