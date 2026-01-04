import { IsString, IsOptional, IsEnum, IsNumber, Length } from 'class-validator';

export class UpdateDeviceDTO {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  problemDescription?: string;

  @IsEnum(['cellphone', 'laptop', 'pc', 'tablet'])
  @IsOptional()
  category?: 'cellphone' | 'laptop' | 'pc' | 'tablet';

  @IsNumber()
  @IsOptional()
  brandId?: number;

  @IsNumber()
  @IsOptional()
  modelId?: number;

  @IsNumber()
  @IsOptional()
  serviceOrderId?: number;
}
