import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { Technician } from './entities/technician.entity';

@Controller('/technicians')
export class TechnicianController {

    constructor(
        private readonly technicianService: TechnicianService,
    ){}

    @Get('/all')
    findAll(): Promise<Technician[]> {
        return this.technicianService.findAll();
    }

    @Get('/id/:id')
    findByID(@Param('id') id: number): Promise<Technician> {
        return this.technicianService.findByID(id);
    }

    @Get('/name/:name')
    findAllByName(@Param('name') name: string): Promise<Technician[]> {
        return this.technicianService.findAllByName(name);
    }

    @Post('/create')
    create(@Body() technician: Technician): Promise<Technician> {
        return this.technicianService.create(technician);
    }

    @Put('/update')
    update(@Body() technician: Technician): Promise<Technician> {
        return this.technicianService.update(technician)
    }

}
