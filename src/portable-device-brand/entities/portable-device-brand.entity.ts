import { ChildEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { PortableDevice } from "../../portable-device/entities/portable-device.entity";
import { PortableDeviceModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@Entity({name: 'tb_portable_device_brands'})
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export class PortableDeviceBrand {
    @ApiProperty()
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Expose()
    @Column({type: 'varchar', length: '255'})
    name: string;

    @ApiProperty()
    @Expose()
    @OneToMany(() => PortableDevice, (device) => device.brand)
    devices: PortableDevice[];

    @ApiProperty()
    @Expose()
    @OneToMany(() => PortableDeviceModel, (model) => model.brand)
    models: PortableDeviceModel[]
}

@ChildEntity()
export class CellphoneBrand extends PortableDeviceBrand {}

@ChildEntity()
export class TabletBrand extends PortableDeviceBrand {}

@ChildEntity()
export class LaptopBrand extends PortableDeviceBrand {}