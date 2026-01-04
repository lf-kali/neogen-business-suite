import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DeviceBrand } from './entities/device-brand.entity';
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
  findAll(): Promise<DeviceBrand[]> {
    return this.deviceBrandService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<DeviceBrand> {
    return this.deviceBrandService.findByID(id);
  }

  @Post('/new')
  create(@Body() dto: CreateDeviceBrandDTO): Promise<DeviceBrand> {
    return this.deviceBrandService.create(dto);
  }

  @Post('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceBrandDTO,
  ): Promise<DeviceBrand> {
    return this.deviceBrandService.update(id, dto);
  }

  @Post('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deviceBrandService.delete(id);
  }
}
