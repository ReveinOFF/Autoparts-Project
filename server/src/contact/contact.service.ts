import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(data) {
    return await this.mailService.sendMail({
      from: 'autopartsinvolved@outlook.com',
      to: 'autopartsinvolved@gmail.com',
      subject: `Autoparts ${data.name}`,
      html: `
      <div>
        <p>Name: ${data.name}</p>
        <p>Email: ${data.email}</p>
        ${data.product ?? `<p>Product: ${data.product}</p>`}
        <p>message: ${data.message}</p>
      </div>
      `,
    });
  }
}
