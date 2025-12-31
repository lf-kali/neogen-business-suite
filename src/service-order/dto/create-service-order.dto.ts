import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

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
}
