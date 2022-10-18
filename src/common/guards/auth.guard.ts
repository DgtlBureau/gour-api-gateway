import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppRequest } from '../types/AppRequest';
import { ClientDto } from '../dto/client.dto';
import { getToken } from '../services/cookie.service';
import { decodeToken } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AppRequest = ctx.switchToHttp().getRequest();

    const token = getToken(request);

    const decodedUser = decodeToken(token) as ClientDto;

    if (decodedUser) return true;
    else throw new UnauthorizedException('Пользователь не авторизован');
  }
}
