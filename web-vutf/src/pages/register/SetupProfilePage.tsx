// src/pages/register/SetupProfilePage.tsx
import { SetupProfileForm } from '../../components/features/register/SetupProfileForm';
import { Link } from 'react-router-dom';

export const SetupProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border-t-4 border-blue-500">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ!</h1>
          <p className="text-gray-500 text-sm">กรุณาตั้งรหัสผ่านและกรอกข้อมูลเพื่อเปิดใช้งานบัญชีของคุณ</p>
        </div>

        <SetupProfileForm />

        <div className="mt-6 text-center text-sm text-gray-500">
           หากพบปัญหา?{' '}
           <a href="#" className="text-blue-600 hover:underline">
              ติดต่อเจ้าหน้าที่
           </a>
        </div>

      </div>
    </div>
  );
};