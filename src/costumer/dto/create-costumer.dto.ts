import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

export class CreateCostumerDTO {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(11)
  @IsPhoneNumber('BR')
  phone: string;

  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsNotEmpty()
  @MaxLength(8)
  cep: string;

  @IsNotEmpty()
  @MaxLength(11)
  cpf: string;

  @IsNotEmpty()
  @MaxLength(14)
  cnpj: string;
}
