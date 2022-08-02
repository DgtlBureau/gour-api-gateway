import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/auth.guard';
import { ImageDto } from '../common/dto/image.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('images')
@Controller('images')
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
  @Post('/upload')
  post(@UploadedFile() image: Express.Multer.File) {
    return this.client.send('upload-image', image);
  }
}
