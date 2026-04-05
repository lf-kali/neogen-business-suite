import { ChildEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { PortableDeviceBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { PortableDeviceModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { InitialDiagnosis } from "./initial-diagnosis";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { HandedAccessories } from "./handed-accessories";

@Exclude()
@Entity({name: 'tb_portable_devices'})
@TableInheritance({column: {type: 'varchar', name: 'type'}})
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
    @ManyToOne(() => PortableDeviceModel, (model) => model.devices)
    model: PortableDeviceModel;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => ServiceOrder, (serviceOrder) => serviceOrder.devices, {onDelete: 'CASCADE', nullable: true})
    serviceOrder: ServiceOrder;

}

@ChildEntity()
export class Cellphone extends PortableDevice {}

@ChildEntity()
export class Tablet extends PortableDevice {}

@ChildEntity()
export class Laptop extends PortableDevice {}