import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { Device } from "../../device/entities/device.entity";
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
    @ManyToOne(() => DeviceBrand, (brand) => brand.models, {onDelete: 'CASCADE'})
    brand: DeviceBrand;

    @ApiProperty()
    @Expose()
    @OneToMany(() => Device, (device) => device.model)
    devices: Device[];
}
