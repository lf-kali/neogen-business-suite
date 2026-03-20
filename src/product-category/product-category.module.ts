import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryController } from './product-category.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[TypeOrmModule.forFeature([ProductCategory]), forwardRef(()=>ProductModule)],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
