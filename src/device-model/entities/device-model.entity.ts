import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PortableDeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { PortableDevice } from "../../portable-device/entities/portable-device.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Entity({name:'device_models'})
export class DeviceModel {
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
