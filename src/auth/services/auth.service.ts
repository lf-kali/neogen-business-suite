import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TechnicianService } from '../../technician/technician.service';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => TechnicianService))
    private technicianService: TechnicianService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, password: string) {
    const userSearch = await this.technicianService.findByEmail(email);

    if (!userSearch)
      throw new HttpException('E-mail não encontrado!', HttpStatus.NOT_FOUND);

    const matchPassword = await this.bcrypt.comparePasswords(
      password,
      userSearch.password,
    );

    if (userSearch && matchPassword) {
      return userSearch;
    }

    return null;
  }

  async login(usuarioLogin: UsuarioLogin) {
    const payload = { sub: usuarioLogin.usuario };

    const userSearch = await this.technicianService.findByEmail(
      usuarioLogin.usuario,
    );

    return {
      id: userSearch?.id,
      name: userSearch?.name,
      email: userSearch?.email,
      profilePicture: userSearch?.profilePicture,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
