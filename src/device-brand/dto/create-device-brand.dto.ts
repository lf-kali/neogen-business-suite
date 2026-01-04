import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateDeviceBrandDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
