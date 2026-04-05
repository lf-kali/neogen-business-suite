import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Costumer } from "../../costumer/entities/costumer.entity";
import { Cellphone, Laptop, PortableDevice, Tablet } from "../../portable-device/entities/portable-device.entity";
import { CellphoneBrand, LaptopBrand, PortableDeviceBrand, TabletBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { Injectable } from "@nestjs/common";
import { Product } from "../../product/entities/product.entity";
import { ProductCategory } from "../../product-category/entities/product-category.entity";
import { ServiceType } from "../../service-type/entities/service-type.entity";
import { CellphoneModel, LaptopModel, PortableDeviceModel, TabletModel } from "../../portable-device-model/entities/portable-device-model.entity";

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
            entities: [
                ServiceOrder, 
                Technician, 
                Costumer, 
                PortableDevice, 
                PortableDeviceBrand, 
                PortableDeviceModel, 
                Cellphone, 
                CellphoneBrand, 
                CellphoneModel, 
                Laptop, 
                LaptopBrand, 
                LaptopModel, 
                Laptop,
                LaptopBrand,
                LaptopModel,
                Tablet,
                TabletBrand,
                TabletModel,
                Product, 
                ProductCategory, 
                ServiceType
            ],
            synchronize: true,
        }
    }
}