import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'autopartsinvolved@gmail.com',
          pass: 'Autoparts_12',
        },
      },
    }),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
