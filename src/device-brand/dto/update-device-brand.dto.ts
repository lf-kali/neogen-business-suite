import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateDeviceBrandDTO {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;
}
