import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "../../device/entities/device.entity";
import { DeviceModel } from "../../device-model/entities/device-model.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Entity({name: 'device_brands'})
export class DeviceBrand {
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
    @OneToMany(() => Device, (device) => device.brand)
    devices: Device[];

    @ApiProperty()
    @Expose()
    @OneToMany(() => DeviceModel, (model) => model.brand)
    models: DeviceModel[]
}
