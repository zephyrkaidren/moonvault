export interface EmailProvider {
  sendPasswordResetEmail(to: string, resetLink: string): Promise<void>;
}

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');
