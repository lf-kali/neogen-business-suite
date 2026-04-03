import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Costumer } from "../../costumer/entities/costumer.entity";
import { PortableDevice } from "../../portable-device/entities/portable-device.entity";
import { PortableDeviceBrand } from "../../device-brand/entities/device-brand.entity";
import { DeviceModel } from "../../device-model/entities/device-model.entity";
import { Injectable } from "@nestjs/common";
import { Product } from "../../product/entities/product.entity";
import { ProductCategory } from "../../product-category/entities/product-category.entity";
import { ServiceType } from "../../service-type/entities/service-type.entity";

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
            entities: [ServiceOrder, Technician, Costumer, PortableDevice, PortableDeviceBrand, DeviceModel, Product, ProductCategory, ServiceType],
            synchronize: true,
        }
    }
}