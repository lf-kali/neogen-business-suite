import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Contrato: body { email, password }
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const validaUsuario = await this.authService.validateUser(email, password);
    if (!validaUsuario) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos!');
    }

    return validaUsuario;
  }
}
