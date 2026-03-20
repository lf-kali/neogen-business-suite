import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServiceTypeService } from './service-type.service';
import { ServiceType } from './entities/service-type.entity';
import { CreateServiceTypeDTO } from './dto/create-service-type.dto';
import { UpdateServiceTypeDTO } from './dto/update-service-type.dto';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@ApiTags('Service Types')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/service-type')
export class ServiceTypeController {
    constructor(private readonly serviceTypeService: ServiceTypeService) {}
    
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<ServiceType[]> {
        return this.serviceTypeService.findAll();
    }

    @Get('/id/:id')
    @HttpCode(HttpStatus.OK)
    findByID(@Param('id', ParseIntPipe) id: number): Promise<ServiceType> {
        return this.serviceTypeService.findById(id);
    }

    @Post('/new')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateServiceTypeDTO): Promise<ServiceType> {
        return this.serviceTypeService.create(dto);
    }

    @Patch('/update/:id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() dto: UpdateServiceTypeDTO){
        return this.serviceTypeService.update(id, dto);
    }

    @Delete('/delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.serviceTypeService.delete(id);
    }

}
