import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PortableDeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { DeviceModel } from "../../device-model/entities/device-model.entity";
import { InitialDiagnosis } from "./initial-diagnosis";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { HandedAccessories } from "./handed-accessories";

@Entity({name: 'tb_portable_devices'})
export class PortableDevice {
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
    @Column({type: 'json', nullable: false})
    initialDiagnosis: InitialDiagnosis;

    @ApiProperty()
    @Expose()
    @Column({type: 'json', nullable: false})
    handedAccessories: HandedAccessories;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => PortableDeviceBrand, (brand) => brand.devices, {onDelete: 'CASCADE'})
    brand: PortableDeviceBrand;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => DeviceModel, (model) => model.devices)
    model: DeviceModel;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => ServiceOrder, (serviceOrder) => serviceOrder.devices, {onDelete: 'CASCADE', nullable: true})
    serviceOrder: ServiceOrder;

}