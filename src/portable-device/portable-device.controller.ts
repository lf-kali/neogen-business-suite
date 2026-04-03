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
import { PortableDevice } from './entities/portable-device.entity';
import { PortableDeviceService } from './portable-device.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreatePortableDeviceDTO } from './dto/create-portable-device.dto';
import { UpdatePortableDeviceDTO } from './dto/update-portable-device.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiTags('Portable Device')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/portable-devices')
export class PorableDeviceController {
  constructor(private readonly portableDeviceService: PortableDeviceService) {}

  @Get('/all')
  findAll(): Promise<PortableDevice[]> {
    return this.portableDeviceService.findAll();
  }

  @Get('/id/:id')
  findByID(@Param('id', ParseIntPipe) id: number): Promise<PortableDevice> {
    return this.portableDeviceService.findByID(id);
  }

  @Post('/new')
  create(@Body() dto: CreatePortableDeviceDTO): Promise<PortableDevice> {
    return this.portableDeviceService.create(dto);
  }

  @Patch('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePortableDeviceDTO,
  ): Promise<PortableDevice> {
    return this.portableDeviceService.update(id, dto);
  }

  @Delete('/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.portableDeviceService.delete(id);
  }
}
