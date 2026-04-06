import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PortableDeviceBaseService } from "../abstract/device-base.service";
import { Tablet } from "../entities/portable-device.entity";
import { TabletBrand } from "../../portable-device-brand/entities/portable-device-brand.entity";
import { TabletModel } from "../../portable-device-model/entities/portable-device-model.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TabletBrandService } from "../../portable-device-brand/tablet-brand/tablet-brand.service";
import { TabletModelService } from "../../portable-device-model/tablet-model/tablet-model.service";
import { ServiceOrderService } from "../../service-order/service-order.service";
import { CreatePortableDeviceDTO } from "../dto/create-portable-device.dto";

@Injectable()
export class TabletService extends PortableDeviceBaseService<Tablet, TabletBrand, TabletModel> {
    constructor(
        @InjectRepository(Tablet)
        repo: Repository<Tablet>,

        brandService: TabletBrandService,
        modelService: TabletModelService,

        @Inject(forwardRef(() => ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(dto: CreatePortableDeviceDTO, brand: TabletBrand, model: TabletModel): Tablet {
        const device = new Tablet();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
    
}