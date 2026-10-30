import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.villa_admin_token;

    if (!token) {
      throw new UnauthorizedException('Debes iniciar sesión');
    }

    request.admin = await this.authService.verifyToken(token);

    return true;
  }
}