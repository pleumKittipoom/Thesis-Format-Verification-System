import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { validatePassword } from '../../../utils/validation';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate หน้าบ้าน
    if (password !== confirmPassword) {
      setError('รหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }
    // ใช้ validatePassword ตัวเดียวกับตอนสมัครสมาชิก (8 ตัว+) ซึ่งครอบคลุม DTO ที่ขอ 6 ตัว
    if (!validatePassword(password)) {
      setError('รหัสผ่านต้องประกอบด้วยตัวพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข (อย่างน้อย 8 ตัวอักษร)');
      return;
    }

    setLoading(true);
    try {
      // ส่งไป Backend (ชื่อ field ต้องเป็น newPassword ตาม DTO)
      await authService.resetPassword({ newPassword: password });
      setIsSuccess(true);
    } catch (err: any) {
      // Token อาจจะหมดอายุ หรือหายไป
      setError(err.message || 'เกิดข้อผิดพลาด หรือเวลาในการทำรายการหมดลง');
    } finally {
      setLoading(false);
    }
  };

  // แสดงหน้า Success
  if (isSuccess) {
    return (
      <div className="text-center w-full max-w-md">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <FiCheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
        <p className="text-gray-500 mb-6">คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที</p>
        <Button onClick={() => navigate('/login')} className="w-full">
          ไปหน้าเข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">ตั้งรหัสผ่านใหม่</h2>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="รหัสผ่านใหม่"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<FiLock />}
          required
          disabled={loading}
        />
        <Input
          label="ยืนยันรหัสผ่านใหม่"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<FiLock />}
          required
          disabled={loading}
        />

        <Button disabled={loading} className="w-full mt-4">
          {loading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
        </Button>
      </form>
    </div>
  );
};