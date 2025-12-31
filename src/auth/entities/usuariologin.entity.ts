import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsuarioLogin {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public usuario: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public senha: string;
}
