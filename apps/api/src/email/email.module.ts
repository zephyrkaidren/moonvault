import { Module } from '@nestjs/common';
import { EMAIL_PROVIDER } from './email-provider.interface';
import { LocalSmtpEmailProvider } from './local-smtp-email.provider';

@Module({
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useClass: LocalSmtpEmailProvider,
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailModule {}
