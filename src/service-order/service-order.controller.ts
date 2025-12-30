import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceOrder } from './entities/service-order.entity';
import { ServiceOrderService } from './service-order.service';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateServiceOrderDto } from './dto/upate-service-order.dto';
import { CreateServiceOrderDTO } from './dto/create-service-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Service Orders')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/service-order')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<ServiceOrder[]> {
    return this.serviceOrderService.findAll();
  }

  @Get('/date/:date')
  @HttpCode(HttpStatus.OK)
  findAllByDate(@Param('date') date: string): Promise<ServiceOrder[]> {
    return this.serviceOrderService.findAllByDate(date);
  }

  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  findByID(@Param('id', ParseIntPipe) id: number) {
    return this.serviceOrderService.findByID(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateServiceOrderDTO): Promise<ServiceOrder> {
    return this.serviceOrderService.create(dto);
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateServiceOrderDto,
  ): Promise<ServiceOrder> {
    return this.serviceOrderService.update(id, dto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.serviceOrderService.delete(id);
  }
}
