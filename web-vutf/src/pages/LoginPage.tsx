import { LoginForm } from '../components/features/auth/LoginForm';
import authImage from '../assets/images/Logo-RMUTT.png';

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {/* Container หลัก (Card สีขาวใหญ่ๆ) */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl flex min-h-[600px]">
        
        {/* Left Side: Image (ซ่อนในมือถือ แสดงในจอ Tablet ขึ้นไป) */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-8 relative">
           {/* ตกแต่ง Background เพิ่มเติมได้ตรงนี้ */}
           <img src={authImage} alt="Logo RMUTT" className="max-w-full h-auto object-contain" />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
          <LoginForm />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;