import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pages, PagesSchema } from './pages.schema';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pages.name, schema: PagesSchema }]),
  ],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
