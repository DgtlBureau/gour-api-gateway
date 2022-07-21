import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { timeout } from 'rxjs';

import { ImageDto } from '../common/dto/image.dto';

@ApiTags('images')
@Controller()
export class ImageController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('upload-image');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: ImageDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  @Post('/images')
  post(@UploadedFile() image: Express.Multer.File) {
    return this.client.send('upload-image', image).pipe(timeout(5000));
  }
}
