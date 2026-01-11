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
import { DeviceModel } from './entities/device-model.entity';
import { DeviceModelService } from './device-model.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateDeviceModelDTO } from './dto/create-device-model.dto';
import { UpdateDeviceModelDTO } from './dto/update-device-model.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiTags('Device Model')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/device-models')
export class DeviceModelController {
  constructor(private readonly deviceModelService: DeviceModelService) {}

  @Get('/all')
  findAll(): Promise<DeviceModel[]> {
    return this.deviceModelService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<DeviceModel> {
    return this.deviceModelService.findByID(id);
  }

  @Post('/new')
  create(@Body() dto: CreateDeviceModelDTO): Promise<DeviceModel> {
    return this.deviceModelService.create(dto);
  }

  @Patch('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceModelDTO,
  ): Promise<DeviceModel> {
    return this.deviceModelService.update(id, dto);
  }

  @Delete('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deviceModelService.delete(id);
  }
}
