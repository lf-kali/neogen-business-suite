import { IsNotEmpty, IsString } from 'class-validator';

export class UsuarioLogin {
  @IsNotEmpty()
  @IsString()
  public usuario: string;

  @IsNotEmpty()
  @IsString()
  public senha: string;
}
