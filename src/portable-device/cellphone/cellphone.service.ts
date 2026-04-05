import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cellphone } from '../entities/portable-device.entity';
import { Repository } from 'typeorm';
import { CellphoneBrand } from '../../portable-device-brand/entities/portable-device-brand.entity';
import { CellPhoneBrandService } from '../../portable-device-brand/cellphone-brand/cellphone-brand.service';
import { CellphoneModel } from '../../portable-device-model/entities/portable-device-model.entity';
import { ServiceOrderService } from '../../service-order/service-order.service';
import { CellphoneModelService } from '../../portable-device-model/cellphone-model/cellphone-model.service';
import { PortableDeviceBaseService } from '../device-base.service';
import { CreatePortableDeviceDTO } from '../dto/create-portable-device.dto';

@Injectable()
export class CellphoneService extends PortableDeviceBaseService<Cellphone, CellphoneBrand, CellphoneModel> {
    constructor(
        @InjectRepository(Cellphone)
        repo: Repository<Cellphone>,

        brandService: CellPhoneBrandService,
        modelService: CellphoneModelService,

        @Inject(forwardRef(() => ServiceOrderService))
        serviceOrderService: ServiceOrderService,
    ) {
        super(repo, brandService, modelService, serviceOrderService);
    }

    protected buildEntity(dto: CreatePortableDeviceDTO, brand: CellphoneBrand, model: CellphoneModel): Cellphone {
        const device = new Cellphone();
        device.problemDescription = dto.problemDescription;
        device.initialDiagnosis = dto.initialDiagnosis;
        device.handedAccessories = dto.handedAccessories;
        device.brand = brand;
        device.model = model;
        return device;
    }
    
}
