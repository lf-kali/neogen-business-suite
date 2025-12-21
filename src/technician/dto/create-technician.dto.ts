import { IsEmail, IsNotEmpty, IsPhoneNumber, IsUrl, Length, MaxLength, MinLength } from "class-validator";

export class CreateTechnicianDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsUrl()
  profilePicture: string;
}