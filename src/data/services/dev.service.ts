import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Costumer } from "../../costumer/entities/costumer.entity";
import { Device } from "../../device/entities/device.entity";
import { DeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { DeviceModel } from "../../device-model/entities/device-model.entity";
import { InitialDiagnosis } from "../../device/entities/initial-diagnosis";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DevService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'db_neogen_business_suite',
            entities: [ServiceOrder, Technician, Costumer, Device, DeviceBrand, DeviceModel, InitialDiagnosis],
            synchronize: true,
        }
    }
}