import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    return res.send(
      '<style>body {background: #333}</style><div style="display: flex; align-items: center; justify-content: center;  color: #fff; font-family: Roboto, sans-serif; font-weight: 500; font-size: 18px">Api gateway started &#128122</div>',
    );
  }
}
