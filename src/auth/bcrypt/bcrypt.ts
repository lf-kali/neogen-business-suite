import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    inputPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, dbPassword);
  }
}
