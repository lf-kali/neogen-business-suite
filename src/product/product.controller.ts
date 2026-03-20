import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { DeleteResult } from 'typeorm';


@UseGuards(JwtAuthGuard)
@ApiTags('Products')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get('/id/:id')
    @HttpCode(HttpStatus.OK)
    findByID(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productService.findByID(id);
    }

    @Post('/new')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productService.create(dto);
    }

    @Patch('/update/:id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() dto: UpdateProductDTO){
        return this.productService.update(id, dto);
    }

    @Delete('/delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.productService.delete(id);
    }
}
