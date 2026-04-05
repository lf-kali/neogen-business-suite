import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';


export class CreateServiceOrderDTO {
  @ApiProperty()
  @IsDateString()
  deadline: Date;
  
  @ApiProperty()
  @IsOptional()
  @IsEnum(['pending' , 'confirmed' , 'acquiring_parts' , 'ongoing' , 'finished' , 'cancelled'])
  status?: 'pending' | 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished' | 'cancelled';

  @ApiProperty()
  @IsNotEmpty()
  technicianId: number;

  @ApiProperty()
  @IsNotEmpty()
  costumerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsInt({each:true})
  @Type(() => Number)
  deviceIDs: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsInt({each:true})
  @Type(() => Number)
  productIDs?: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsInt({each:true})
  @Type(() => Number)
  serviceTypeIDs: number[];

}
