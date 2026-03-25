import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { ProductCategory } from "../../product-category/entities/product-category.entity";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@Entity({name: 'tb_product'})
export class Product {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Column({length: 100, nullable: false})
    name: string;

    @Expose()
    @Column({length: 255, nullable: true})
    desc?: string;

    @Expose()
    @Column({length: 30, nullable: false})
    sku: string;

    @Expose()
    @Column({length: 44, nullable: true})
    barCode?: string;

    @Expose()
    @Column({type: 'float', nullable: false, })
    costPrice: number;

    @Expose()
    @Column({type: 'float', nullable: false})
    salePrice: number;

    @Expose()
    @Column({type: 'int', default: 0})
    currentStock?: number;

    @Expose()
    @ManyToOne(()=>ProductCategory, (category) => category.products, { onDelete: 'CASCADE' })
    category?: ProductCategory;

    @Expose()
    @ManyToMany(()=> ServiceOrder, (serviceorder) => serviceorder.products)
    serviceOrders: ServiceOrder[];
}