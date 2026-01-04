import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateDeviceModelDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
