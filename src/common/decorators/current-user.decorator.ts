import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AppRequest } from '../types/AppRequest';
import { decodeToken } from '../services/jwt.service';
import { getToken } from '../services/cookie.service';
import { ClientDto } from '../dto/client.dto';

export const CurrentUser = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const decodedUser = decodeToken(getToken(request)) as ClientDto;

    if (!decodedUser) throw new UnauthorizedException();

    return data ? decodedUser[data] : decodedUser;
  },
);
