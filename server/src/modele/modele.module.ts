import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModeleService } from './modele.service';
import { Modele, ModeleSchema } from './modele.schema';
import { ModeleController } from './modele.controller';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Modele.name, schema: ModeleSchema }]),
  ],
  controllers: [ModeleController],
  providers: [ModeleService, FilesService],
})
export class ModeleModule {}
