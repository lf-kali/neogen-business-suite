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
import { Device } from './entities/device.entity';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateDeviceDTO } from './dto/create-device.dto';
import { UpdateDeviceDTO } from './dto/update-device.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiTags('Device')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/all')
  findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<Device> {
    return this.deviceService.findByID(id);
  }

  @Post('/new')
  create(@Body() dto: CreateDeviceDTO): Promise<Device> {
    return this.deviceService.create(dto);
  }

  @Post('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceDTO,
  ): Promise<Device> {
    return this.deviceService.update(id, dto);
  }

  @Post('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.delete(id);
  }
}
