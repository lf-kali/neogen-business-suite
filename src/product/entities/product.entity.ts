import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { ProductCategory } from "../../product-category/entities/product-category.entity";

@Entity({name: 'tb_product'})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, nullable: false})
    name: string;

    @Column({length: 255, nullable: true})
    desc?: string;

    @Column({length: 30, nullable: false})
    sku: string;

    @Column({length: 44, nullable: true})
    barCode?: string;

    @Column({type: 'float', nullable: false, })
    costPrice: number;

    @Column({type: 'float', nullable: false})
    salePrice: number;

    @Column({type: 'int', default: 0})
    currentStock?: number;

    @ManyToOne(()=>ProductCategory, (category) => category.products, { onDelete: 'CASCADE' })
    category?: ProductCategory;

    @ManyToMany(()=> ServiceOrder, (serviceorder) => serviceorder.products)
    serviceOrders: ServiceOrder[];
}