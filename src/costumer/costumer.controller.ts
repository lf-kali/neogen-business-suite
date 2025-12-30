import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Costumer } from './entities/costumer.entity';
import { CostumerService } from './costumer.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCostumerDTO } from './dto/create-costumer.dto';
import { UpdateCostumerDTO } from './dto/update-costumer.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/costumers')
export class CostumerController {
  constructor(private readonly costumerService: CostumerService) {}

  @Get('/all')
  findAll(): Promise<Costumer[]> {
    return this.costumerService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<Costumer> {
    return this.costumerService.findByID(id);
  }

  @Post('/new')
  create(@Body() dto: CreateCostumerDTO): Promise<Costumer> {
    return this.costumerService.create(dto);
  }

  @Post('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCostumerDTO,
  ): Promise<Costumer> {
    return this.costumerService.update(id, dto);
  }
}
