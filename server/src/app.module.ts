import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './authentication/authentication.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LangModule } from './lang/lang.module';
import { CurrModule } from './currency/currency.module';
import { MarkModule } from './mark/mark.module';
import { ModeleModule } from './modele/modele.module';
import { OrderModule } from './order/order.module';
import { PagesModule } from './pages/pages.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ContactModule } from './contact/contact.module';
import { RecallModule } from './recall/recall.module';
import { InfoModule } from './info/info.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'upload'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGO_LINK');
        const appEnv = configService.get('APP_ENV');
        console.log(uri);

        return {
          uri,
          dbName: appEnv === 'DEV' ? 'crave_u' : 'name_databases',
        };
      },
    }),
    FilesModule,
    AuthenticationModule,
    CategoriesModule,
    ProductModule,
    LangModule,
    CurrModule,
    ModeleModule,
    MarkModule,
    OrderModule,
    PagesModule,
    SubcategoriesModule,
    ContactModule,
    RecallModule,
    InfoModule,
  ],
  controllers: [],
})
export class AppModule {}
