import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { VerifyOtpForm } from '../../components/features/register/VerifyOtpForm';

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">      
        <div className="mb-8">
            <button 
                onClick={() => navigate(-1)} 
                className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm transition-colors"
            >
                <FiArrowLeft /> กลับ
            </button>
            <h1 className="text-2xl font-bold text-gray-900 text-center">ยืนยันอีเมล</h1>
            <p className="text-gray-500 text-sm text-center mt-2">
                รหัส OTP ถูกส่งไปที่ <span className="font-medium text-blue-600">{email}</span>
            </p>
        </div>

        <VerifyOtpForm />

      </div>
    </div>
  );
};