import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
