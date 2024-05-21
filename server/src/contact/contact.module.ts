import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'autopartsinvolved@gmail.com',
          pass: 'qttkzgwcknydrsnq',
        },
      },
    }),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
