import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PortableDevice } from "./entities/portable-device.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PortableDevice]),
    ],
    exports: [
        TypeOrmModule,
    ],
})
export class PortableDeviceModule {}