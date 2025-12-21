import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { Technician } from './entities/technician.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('/technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAll(): Promise<Technician[]> {
    return this.technicianService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/id/:id')
  findByID(@Param('id') id: number): Promise<Technician> {
    return this.technicianService.findByID(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/name/:name')
  findAllByName(@Param('name') name: string): Promise<Technician[]> {
    return this.technicianService.findAllByName(name);
  }

  @Post('/create')
  create(@Body() technician: Technician): Promise<void> {
    return this.technicianService.create(technician);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  update(@Body() technician: Technician): Promise<void> {
    return this.technicianService.update(technician);
  }
}
