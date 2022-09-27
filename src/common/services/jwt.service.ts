import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { instanceToPlain } from 'class-transformer';
config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

import { AES, enc } from 'crypto-js';

export function encodeJwt(obj: object) {
  return jwt.sign(instanceToPlain(obj), ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function encodeRefreshJwt(obj: object) {
  return jwt.sign(instanceToPlain(obj), REFRESH_SECRET, {
    expiresIn: '30d',
  });
}

export function verifyJwt(token: string, secretKey: string): boolean {
  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}
