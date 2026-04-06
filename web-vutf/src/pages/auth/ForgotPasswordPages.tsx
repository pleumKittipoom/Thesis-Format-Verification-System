import { ForgotPasswordForm } from '../../components/features/auth/ForgotPasswordForm';
import { VerifyForgotOtpForm } from '../../components/features/auth/VerifyForgotOtpForm';
import { ResetPasswordForm } from '../../components/features/auth/ResetPasswordForm';

// Layout กลางสำหรับ 3 หน้านี้
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
      {children}
    </div>
  </div>
);

export const ForgotPasswordPage = () => (
  <AuthLayout><ForgotPasswordForm /></AuthLayout>
);

export const VerifyForgotOtpPage = () => (
  <AuthLayout><VerifyForgotOtpForm /></AuthLayout>
);

export const ResetPasswordPage = () => (
  <AuthLayout><ResetPasswordForm /></AuthLayout>
);