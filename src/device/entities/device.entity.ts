import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { DeviceModel } from "../../device-model/entities/device-model.entity";
import { InitialDiagnosis } from "./initial-checklist";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Entity({name: 'tb_devices'})
export class Device {
    @ApiProperty()
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Expose()
    @Column({ name: 'problem_description', length: 255, nullable: false })
    problemDescription: string;

    @ApiProperty()
    @Expose()
    @Column({type: 'enum', enum: ['cellphone', 'laptop', 'pc', 'tablet']})
    category: 'cellphone' | 'laptop' | 'pc' | 'tablet';

    @ApiProperty()
    @Expose()
    @ManyToOne(() => DeviceBrand, (brand) => brand.devices, {onDelete: 'CASCADE'})
    brand: DeviceBrand;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => DeviceModel, (model) => model.devices)
    model: DeviceModel;

    @ApiProperty()
    @Expose()
    @OneToOne(() => InitialDiagnosis, (diag) => diag.device, {cascade: true})
    initialDiagnosis: InitialDiagnosis;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => ServiceOrder, (serviceOrder) => serviceOrder.devices, {onDelete: 'CASCADE'})
    serviceOrder: ServiceOrder;

}