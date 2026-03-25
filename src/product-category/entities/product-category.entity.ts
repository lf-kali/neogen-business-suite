import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Expose } from "class-transformer";

@Entity({name: 'tb_product_category'})
export class ProductCategory {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Column({length: 80})
    name: string;

    @Expose()
    @OneToMany(()=> Product, (product) => product.category)
    products: Product[];
}