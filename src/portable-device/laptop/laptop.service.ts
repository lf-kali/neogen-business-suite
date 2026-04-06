import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PortableDeviceBaseService } from "../abstract/device-base.service";
import { Laptop } from "../entities/portable-device.entity";
import { LaptopBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { LaptopModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LaptopBrandService } from "../../portable-device-brand/laptop-brand/laptop-brand.service";
import { LaptopModelService } from "../../portable-device-model/laptop-model/laptop-model.service";
import { ServiceOrderService } from "../../service-order/service-order.service";
import { CreatePortableDeviceDTO } from "../dto/create-portable-device.dto";

@Injectable()
export class LaptopService extends PortableDeviceBaseService<Laptop, LaptopBrand, LaptopModel> {
    constructor(
        @InjectRepository(Laptop)
        repo: Repository<Laptop>,

        brandService: LaptopBrandService,
        modelService: LaptopModelService,

        @Inject(forwardRef(() => ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(dto: CreatePortableDeviceDTO, brand: LaptopBrand, model: LaptopModel): Laptop {
        const device = new Laptop();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
    
}