import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPasswordHash =
      this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminUsername || !adminPasswordHash) {
      throw new Error('Faltan las credenciales del administrador en .env');
    }

    if (username !== adminUsername) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      adminPasswordHash,
    );

    if (!passwordCorrect) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = {
      sub: 'administradora',
      username: adminUsername,
      role: 'admin',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      token,
    };
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }
}