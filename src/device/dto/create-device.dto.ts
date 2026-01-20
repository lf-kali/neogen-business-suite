import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, Length, IsOptional } from 'class-validator';
import { InitialDiagnosis } from '../entities/initial-diagnosis';

export class CreateDeviceDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  problemDescription: string;

  @ApiProperty()
  @IsEnum(['cellphone', 'laptop', 'pc', 'tablet'])
  @IsNotEmpty()
  category: 'cellphone' | 'laptop' | 'pc' | 'tablet';

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  modelId: number;

  @ApiProperty()
  @IsNotEmpty()
  initialDiagnosis: InitialDiagnosis;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  serviceOrderId: number;
}
