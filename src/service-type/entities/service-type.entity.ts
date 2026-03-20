import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";

@Entity({name: 'tb_service_types'})
export class ServiceType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100, nullable: false})
    name: string;

    @Column({type: 'float', nullable: true})
    costPrice?: number;

    @Column({type: 'float', nullable: false})
    salePrice: number;

    @Column({type: 'float', nullable: true})
    comissionPercent?: number;

    @Column({type: 'varchar', length: 255, nullable: true})
    desc?: string;

    @ManyToMany(() => ServiceOrder, (serviceorder) => serviceorder.services)
    serviceOrders: ServiceOrder[]
}