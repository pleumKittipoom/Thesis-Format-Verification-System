// src/pages/register/RegisterEmailPage.tsx
import { RegisterEmailForm } from '../../components/features/register/RegisterEmailForm';
import { Link } from 'react-router-dom';

export const RegisterEmailPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ลงทะเบียน</h1>
          <p className="text-gray-500 text-sm">กรุณากรอกอีเมลมหาวิทยาลัยเพื่อยืนยันตัวตน</p>
        </div>

        <RegisterEmailForm /> 

        <div className="mt-6 text-center">
             <Link to="/login" className="text-sm text-blue-600 hover:underline">
                กลับไปหน้าเข้าสู่ระบบ
             </Link>
        </div>

      </div>
    </div>
  );
};