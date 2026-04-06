import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PortableDevice } from "./entities/portable-device.entity";
import { PortableDeviceSearchService } from "./portable-device-search.service";
import { PortableDeviceSearchController } from "./portable-device-search.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([PortableDevice]),
    ],
    providers: [PortableDeviceSearchService],
    controllers: [PortableDeviceSearchController],
    exports: [
        TypeOrmModule,
    ],
})
export class PortableDeviceModule {}