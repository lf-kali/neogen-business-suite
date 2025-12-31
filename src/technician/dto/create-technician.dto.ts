import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTechnicianDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(11)
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty()
  @IsUrl()
  profilePicture: string;
}
