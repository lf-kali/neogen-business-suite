import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

export class CreateCostumerDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

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
  @IsNotEmpty()
  @MaxLength(8)
  cep: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(11)
  cpf: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(14)
  cnpj?: string;
}
