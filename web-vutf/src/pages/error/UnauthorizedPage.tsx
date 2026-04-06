import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Access Denied</h2>
      <p className="text-gray-600 mb-8">
        ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Role ของคุณไม่ถูกต้อง)
      </p>
      <button
        onClick={() => navigate(-1)} // ย้อนกลับไปหน้าเดิม
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};