import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class UpdateDeviceModelDTO {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsNumber()
  @IsOptional()
  brandId?: number;
}
