import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity({name: 'tb_product_category'})
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 80})
    name: string;

    @OneToMany(()=> Product, (product) => product.category)
    products: Product[];
}