import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AppRequest } from '../types/AppRequest';
import { decodeToken } from '../services/jwt.service';
import { getToken } from '../services/cookie.service';
import { ClientDto } from '../dto/client.dto';

export const fakeDecodedUser = {
  id: 45,
  createdAt: '2022-07-01T15:37:42.259Z',
  updatedAt: '2022-08-10T14:52:26.060Z',
  deletedAt: null,
  isApproved: false,
  additionalInfo: {},
  firstName: 'Иван',
  lastName: 'Иванов',
  phone: '+7 (999) 888-77-66',
  email: 'ivanov@newshift.ru',
  lives: 3,
  role: {
    id: 1,
    createdAt: '2022-03-03T03:55:17.799Z',
    updatedAt: '2022-03-03T03:55:17.799Z',
    deletedAt: null,
    title: 'Клиент',
    key: 'CLIENT',
  },
  city: {
    id: 39,
    createdAt: '2022-07-22T10:01:21.949Z',
    updatedAt: '2022-07-22T10:01:21.949Z',
    deletedAt: null,
    name: {
      id: 1072,
      createdAt: '2022-07-22T10:01:21.949Z',
      updatedAt: '2022-07-22T10:01:21.949Z',
      deletedAt: null,
      en: 'Lyubitino',
      ru: 'Любытино',
    },
  },
  referralCode: null,
  avatar: {
    id: 275,
    createdAt: '2022-08-02T09:12:29.745Z',
    updatedAt: '2022-08-02T09:12:29.745Z',
    deletedAt: null,
    small:
      'http://localhost:5112/static/images/f43d4250-e69b-496a-9fef-a434bf2d94e0.jpeg',
    full: 'http://localhost:5112/static/images/f43d4250-e69b-496a-9fef-a434bf2d94e0.jpeg',
  },
  iat: 1661150220,
  exp: 1661151120,
};

export const CurrentUser = createParamDecorator(
  async (data: keyof ClientDto, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();

    // const token = getToken(request);

    // const decodedUser = decodeToken(token) as ClientDto;

    // if (!decodedUser) throw new UnauthorizedException();

    const decodedUser = fakeDecodedUser;
    return data ? decodedUser[data] : decodedUser;
  },
);
