import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailProvider } from './email-provider.interface';

@Injectable()
export class LocalSmtpEmailProvider implements EmailProvider {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Moonvault <noreply@moonvault.local>',
      to,
      subject: 'Reset your Moonvault password',
      text: `Reset your password here: ${resetLink}\n\nThis link expires in 30 minutes. If you didn't request this, ignore this email.`,
      html: `<p>Reset your password by clicking the link below:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 30 minutes. If you didn't request this, ignore this email.</p>`,
    });
  }
}
