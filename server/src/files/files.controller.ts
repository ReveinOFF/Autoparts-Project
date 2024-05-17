import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HTTP_MESSAGE } from 'src/enum/enum';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const fileNames = await this.filesService.uploadFiles(files, 'upload');

    return fileNames;
  }

  @Post('delete-files')
  async deletesFile(@Body() { files }: { files: string[] }) {
    await this.filesService.deleteFiles(files, 'upload');
    return HTTP_MESSAGE.FILE_DELETE;
  }
}
