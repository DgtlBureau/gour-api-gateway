import { Injectable } from '@nestjs/common';
import { CookieOptions, Response, Request } from 'express';

const ACCESS_TOKEN_STORE_NAME = 'StoreAccessToken';
const REFRESH_TOKEN_STORE_NAME = 'StoreRefreshToken';
const ACCESS_TOKEN_ADMIN_NAME = 'AdminAccessToken';
const REFRESH_TOKEN_ADMIN_NAME = 'AdminRefreshToken';

@Injectable()
export class CookieService {
  PHONE_CODE_NAME = 'PhoneCodeHash';
  EMAIL_CODE_NAME = 'EmailCodeHash';
  NEW_DATE = new Date();
  private HOUR = 3_600_000;
  private MAX_AGE_15_MIN = this.HOUR / 4;
  private MAX_AGE_1_DAY = this.HOUR * 24;
  private MAX_AGE_30_DAYS = this.MAX_AGE_1_DAY * 30;
  private sameSite: CookieOptions['sameSite'] =
    process.env.NODE_ENV === 'production' ? 'lax' : 'none';

  private get defaultOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      maxAge: this.MAX_AGE_15_MIN,
      sameSite: this.sameSite,
    };
  }

  get phoneCodeOptions(): CookieOptions {
    return this.defaultOptions;
  }

  get emailCodeOptions(): CookieOptions {
    return this.defaultOptions;
  }

  private get accessTokenStoreOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
      domain: process.env.COMMON_DOMAIN,
    };
  }

  private get refreshTokenStoreOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
      domain: process.env.COMMON_DOMAIN,
      maxAge: this.MAX_AGE_30_DAYS,
    };
  }

  private get accessTokenAdminOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
    };
  }

  private get refreshTokenAdminOptions(): CookieOptions {
    return {
      ...this.defaultOptions,
      maxAge: this.MAX_AGE_30_DAYS,
    };
  }

  getAccessToken(req: Request, isStore: boolean) {
    const tokenName = isStore
      ? ACCESS_TOKEN_STORE_NAME
      : ACCESS_TOKEN_ADMIN_NAME;
    return req.cookies[tokenName];
  }

  getRefreshToken(req: Request, isStore: boolean) {
    const tokenName = isStore
      ? REFRESH_TOKEN_STORE_NAME
      : REFRESH_TOKEN_ADMIN_NAME;
    return req.cookies[tokenName];
  }

  setAccessToken(res: Response, token: string, isStore: boolean) {
    if (isStore) {
      return res.cookie(
        ACCESS_TOKEN_STORE_NAME,
        token,
        this.accessTokenStoreOptions,
      );
    }
    res.cookie(ACCESS_TOKEN_ADMIN_NAME, token, this.accessTokenAdminOptions);
  }

  setRefreshToken(res: Response, token: string, isStore: boolean) {
    if (isStore) {
      return res.cookie(
        REFRESH_TOKEN_STORE_NAME,
        token,
        this.refreshTokenStoreOptions,
      );
    }
    res.cookie(REFRESH_TOKEN_ADMIN_NAME, token, this.refreshTokenAdminOptions);
  }

  clearAllTokens(res: Response, isStore: boolean) {
    if (isStore) {
      res.clearCookie(ACCESS_TOKEN_STORE_NAME, this.accessTokenStoreOptions);
      res.clearCookie(REFRESH_TOKEN_STORE_NAME, this.refreshTokenStoreOptions);
      return;
    }

    res.clearCookie(ACCESS_TOKEN_ADMIN_NAME, this.accessTokenAdminOptions);
    res.clearCookie(REFRESH_TOKEN_ADMIN_NAME, this.refreshTokenAdminOptions);
  }
}

export function getToken(req: Request): string | undefined {
  const header = req.header('Authorization');
  if (header) {
    return header.replace('Bearer ', '');
  }

  return (
    req.cookies[ACCESS_TOKEN_ADMIN_NAME] || req.cookies[ACCESS_TOKEN_STORE_NAME]
  );
}
