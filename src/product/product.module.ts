import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ServiceOrderModule } from '../service-order/service-order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProductCategoryModule, forwardRef(()=>ServiceOrderModule)],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
