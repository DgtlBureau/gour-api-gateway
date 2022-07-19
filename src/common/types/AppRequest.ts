import { Request } from 'express';

import { ClientDto } from '../dto/client.dto';

export interface AppRequest extends Request {
  user?: ClientDto;
  token?: string;
}
