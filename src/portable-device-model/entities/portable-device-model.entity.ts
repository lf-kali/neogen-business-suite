import { ChildEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { PortableDeviceBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { PortableDevice } from "../../portable-device/entities/portable-device.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@Entity({name:'device_models'})
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export class PortableDeviceModel {
    @ApiProperty()
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Expose()
    @Column({type: 'varchar', length: 255})
    name: string;

    @ApiProperty()
    @Expose()
    @ManyToOne(() => PortableDeviceBrand, (brand) => brand.models, {onDelete: 'CASCADE'})
    brand: PortableDeviceBrand;

    @ApiProperty()
    @Expose()
    @OneToMany(() => PortableDevice, (device) => device.model)
    devices: PortableDevice[];
}

@ChildEntity()
export class CellphoneModel extends PortableDeviceModel {}

@ChildEntity()
export class LaptopModel extends PortableDeviceModel {}

