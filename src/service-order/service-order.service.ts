import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { Between, Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { TechnicianService } from '../technician/technician.service';
import { CreateServiceOrderDTO } from './dto/create-service-order.dto';
import { CostumerService } from '../costumer/costumer.service';
import { UpdateServiceOrderDto } from './dto/upate-service-order.dto';
import { PortableDeviceService } from '../portable-device/portable-device.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';
import { ServiceType } from '../service-type/entities/service-type.entity';
import { ServiceTypeService } from '../service-type/service-type.service';

@Injectable()
export class ServiceOrderService {
  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,
    private technicianService: TechnicianService,
    private costumerService: CostumerService,
    @Inject(forwardRef(() => PortableDeviceService))
    private deviceService: PortableDeviceService,
    private productService: ProductService,
    private serviceTypeService: ServiceTypeService,
  ) {}

  async findAll(): Promise<ServiceOrder[]> {
    return await this.serviceOrderRepository.find({
      relations: {
        technician: true,
        costumer: true,
        devices: true,
        products: true,
      },
    });
  }

  async findAllByDate(date: string): Promise<ServiceOrder[]> {
    const dateSearch = await this.serviceOrderRepository.find({
      where: {
        entryDate: Between(
          new Date(`${date}T00:00:00.000Z`),
          new Date(`${date}T23:59:59.999Z`),
        ),
      },
      relations: {
        technician: true,
        costumer: true,
        devices: true,
        products: true,
      },
    });
    return dateSearch;
  }

  async findByID(id: number): Promise<ServiceOrder> {
    const serviceOrder = await this.serviceOrderRepository.findOne({
      where: {
        id,
      },
      relations: {
        technician: true,
        costumer: true,
        devices: true,
        products: true,
        services: true,
      },
    });
    if (!serviceOrder) {
      throw new HttpException(
        'Ordem de serviço não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    return serviceOrder;
  }

  async create(dto: CreateServiceOrderDTO): Promise<ServiceOrder> {
    const technician = await this.technicianService.findByID(dto.technicianId);
    const costumer = await this.costumerService.findByID(dto.costumerId);

    const protoServiceOrder = this.serviceOrderRepository.create(dto);
    
    protoServiceOrder.technician = technician;
    protoServiceOrder.costumer = costumer;
    protoServiceOrder.services = await this.addServiceTypesByID(dto.serviceTypeIDs);

    if (dto.productIDs){
      protoServiceOrder.products = await this.addProductsByID(dto.productIDs);
    }
    
    protoServiceOrder.finalPrice = this.getFinalPrice(protoServiceOrder.services, protoServiceOrder.products);



    const serviceOrder = await this.serviceOrderRepository.save(protoServiceOrder);

    for (let id of dto.deviceIDs){
      await this.deviceService.update(id, {serviceOrderId: serviceOrder.id});
    }

    return this.findByID(serviceOrder.id);
  }

  async update(id: number, dto: UpdateServiceOrderDto): Promise<ServiceOrder> {
    const serviceOrder = await this.findByID(id);

    if (dto.technicianId) {
      const technician = await this.technicianService.findByID(
        dto.technicianId,
      );
      serviceOrder.technician = technician;
    }

    if (dto.costumerId) {
      const costumer = await this.costumerService.findByID(dto.costumerId);
      serviceOrder.costumer = costumer;
    }

    if (dto.deviceIDs) {
      for (let id of dto.deviceIDs){
        await this.deviceService.update(id, {serviceOrderId: serviceOrder.id})
      }
    }
    
    if (dto.serviceTypeIDs){
      serviceOrder.services = await this.addServiceTypesByID(dto.serviceTypeIDs);
    }

    if (dto.productIDs){
      serviceOrder.products = await this.addProductsByID(dto.productIDs);
    }

    serviceOrder.finalPrice = this.getFinalPrice(serviceOrder.services, serviceOrder.products)

    const noRelationDto: Omit<
      UpdateServiceOrderDto,
      'technicianId' | 'costumerId' | 'deviceIDs' | 'productIDs' | 'serviceTypeIDs'
    > = dto;

    Object.assign(serviceOrder, noRelationDto);
    return await this.serviceOrderRepository.save(serviceOrder);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByID(id);

    return await this.serviceOrderRepository.delete(id);
  }

  private async addProductsByID(IDs: number[]): Promise<Product[]> {
    const products: Product[] = []; 
    for (let id of IDs) {
      const product = await this.productService.findByID(id);
      products.push(product);
    }

    return products;
  }

  private async addServiceTypesByID(IDs: number[]): Promise<ServiceType[]> {
    const services: ServiceType[] = [];
    for (let id of IDs) {
      const service = await this.serviceTypeService.findById(id);
      services.push(service);
    }

    return services;
  }

  private getFinalPrice(services?: ServiceType[], products?: Product[]) {
    let total: number = 0;

    if (!services) return total;
    
    for (let service of services) {
      const price = service.salePrice;
      total += price;
    }

    if (!products) return total;

    for (let product of products) {
      const price = product.salePrice;
      total += price;
    }    

    return total;
  }
}
