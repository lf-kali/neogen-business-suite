import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreateDeviceDTO } from '../../device/dto/create-device.dto';
import { Device } from '../../device/entities/device.entity';

export class CreateServiceOrderDTO {
  
  @ApiProperty()
  @IsNotEmpty()
  problemDescription: string;

  @ApiProperty()
  @IsDateString()
  deadline: Date;

  @ApiProperty()
  @IsOptional()
  status?: 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished';

  @ApiProperty()
  @IsNotEmpty()
  technicianId: number;

  @ApiProperty()
  @IsNotEmpty()
  costumerId: number;

  @ApiProperty()
  @ValidateNested()
  devices: Device[];
}
