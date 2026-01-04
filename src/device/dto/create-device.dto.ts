import { IsString, IsNotEmpty, IsEnum, IsNumber, Length, IsOptional } from 'class-validator';

export class CreateDeviceDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  problemDescription: string;

  @IsEnum(['cellphone', 'laptop', 'pc', 'tablet'])
  @IsNotEmpty()
  category: 'cellphone' | 'laptop' | 'pc' | 'tablet';

  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsNumber()
  @IsNotEmpty()
  modelId: number;

  @IsNumber()
  @IsOptional()
  serviceOrderId?: number;
}
