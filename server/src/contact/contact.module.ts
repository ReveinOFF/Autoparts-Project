import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: 'autopartsinvolved@outlook.com',
          pass: 'AutopartsHjkknjy389',
        },
      },
    }),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
