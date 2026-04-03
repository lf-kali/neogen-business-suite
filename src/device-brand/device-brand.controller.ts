import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PortableDeviceBrand } from './entities/device-brand.entity';
import { DeviceBrandService } from './device-brand.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateDeviceBrandDTO } from './dto/create-device-brand.dto';
import { UpdateDeviceBrandDTO } from './dto/update-device-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiTags('Device Brand')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/device-brands')
export class DeviceBrandController {
  constructor(private readonly deviceBrandService: DeviceBrandService) {}

  @Get('/all')
  findAll(): Promise<PortableDeviceBrand[]> {
    return this.deviceBrandService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<PortableDeviceBrand> {
    return this.deviceBrandService.findByID(id);
  }

  @Get('/name/:name')
  findByName(@Param('name') name: string): Promise<PortableDeviceBrand[]>{
    return this.deviceBrandService.findByName(name)
  }

  @Post('/new')
  create(@Body() dto: CreateDeviceBrandDTO): Promise<PortableDeviceBrand> {
    return this.deviceBrandService.create(dto);
  }

  @Patch('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceBrandDTO,
  ): Promise<PortableDeviceBrand> {
    return this.deviceBrandService.update(id, dto);
  }

  @Delete('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deviceBrandService.delete(id);
  }
}
