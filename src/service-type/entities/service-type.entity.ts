import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@Entity({name: 'tb_service_types'})
export class ServiceType {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Column({length: 100, nullable: false})
    name: string;

    @Expose()
    @Column({type: 'float', nullable: true})
    costPrice?: number;

    @Expose()
    @Column({type: 'float', nullable: false})
    salePrice: number;

    @Expose()
    @Column({type: 'float', nullable: true})
    comissionPercent?: number;

    @Expose()
    @Column({type: 'varchar', length: 255, nullable: true})
    desc?: string;

    @Expose()
    @ManyToMany(() => ServiceOrder, (serviceorder) => serviceorder.services)
    serviceOrders: ServiceOrder[]
}