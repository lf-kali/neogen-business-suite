import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ServiceOrder } from './entities/service-order.entity';
import { ServiceOrderService } from './service-order.service';
import { DeleteResult } from 'typeorm';

@Controller('ordem-servico')
export class ServiceOrderController {
    
    constructor(private readonly serviceOrderService: ServiceOrderService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<ServiceOrder[]> {
        return this.serviceOrderService.findAll();
    }

    @Get('/date/:date')
    @HttpCode(HttpStatus.OK)
    findAllByDate(@Param('date') date: string): Promise<ServiceOrder[]> {
        return this.serviceOrderService.findAllByDate(date);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findByID(@Param('id', ParseIntPipe) id: number) {
        return this.serviceOrderService.findByID(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() serviceOrder: ServiceOrder): Promise<ServiceOrder> {
        return this.serviceOrderService.create(serviceOrder);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() serviceOrder: ServiceOrder): Promise<ServiceOrder> {
        return this.serviceOrderService.update(serviceOrder)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.serviceOrderService.delete(id)
    }
}
