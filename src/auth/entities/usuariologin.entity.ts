import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsuarioLogin {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;
}
