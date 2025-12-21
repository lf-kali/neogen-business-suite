import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { Technician } from './entities/technician.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Controller('/technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all')
  findAll(): Promise<Technician[]> {
    return this.technicianService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/id/:id')
  findByID(@Param('id') id: number): Promise<Technician> {
    return this.technicianService.findByID(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/name/:name')
  findAllByName(@Param('name') name: string): Promise<Technician[]> {
    return this.technicianService.findAllByName(name);
  }

  @Post('/create')
  create(@Body() dto: CreateTechnicianDto): Promise<Technician> {
    return this.technicianService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianDto): Promise<Technician> {
    return this.technicianService.update(id, dto);
  }
}
