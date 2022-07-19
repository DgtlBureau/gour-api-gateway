import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AppRequest } from '../types/AppRequest';
import { decodeToken } from '../services/jwt.service';
import { getToken } from '../services/cookie.service';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const decodedUser = decodeToken(getToken(request)) as { id: number };

    console.log('decodedUser', decodedUser);

    if (decodedUser) return decodedUser;
    else throw new UnauthorizedException();
  },
);
