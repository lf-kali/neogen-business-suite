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
import { TechnicianService } from './technician.service';
import { Technician } from './entities/technician.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Technician')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAll(): Promise<Technician[]> {
    return this.technicianService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/id/:id')
  findByID(@Param('id') id: number): Promise<Technician> {
    return this.technicianService.findByID(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/name/:name')
  findAllByName(@Param('name') name: string): Promise<Technician[]> {
    return this.technicianService.findAllByName(name);
  }

  @Post('/create')
  create(@Body() dto: CreateTechnicianDto): Promise<Technician> {
    return this.technicianService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnicianDto,
  ): Promise<Technician> {
    return this.technicianService.update(id, dto);
  }
}
