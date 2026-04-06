import { RegisterForm } from '../../components/features/register/RegisterForm';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">สร้างบัญชีผู้ใช้</h1>
          <p className="text-gray-500 text-sm">กรุณากรอกข้อมูลส่วนตัวเพื่อเริ่มต้นใช้งาน</p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-gray-500">
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
               เข้าสู่ระบบ
            </Link>
        </div>

      </div>
    </div>
  );
};