// src/components/features/register/RegisterForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiLock, FiAlertCircle, FiLayers } from 'react-icons/fi';

import { authService } from '../../../services/auth.service';
import { classSectionService } from '../../../services/class-section.service';
import { validatePassword, validateThaiName, validateThaiPhone } from '../../../utils/validation';
import { Input } from '../../common/Input';
import { ClassSection } from '../../../types/class-section';

export const RegisterForm = () => {
  const navigate = useNavigate();

  // 1. State สำหรับ Form Data
  const [formData, setFormData] = useState({
    prefixName: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sectionId: ''
  });

  // State สำหรับเก็บรายการกลุ่มเรียนที่จะแสดงใน Dropdown
  const [sections, setSections] = useState<ClassSection[]>([]);

  // 2. ดึง Email จาก SessionStorage
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ตรวจสอบสิทธิ์
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registerEmail');
    const storedToken = sessionStorage.getItem('registrationToken');

    if (!storedEmail || !storedToken) {
      navigate('/register/email', { replace: true });
    } else {
      setEmail(storedEmail);
      setIsAuthorized(true);
    }
  }, [navigate]);

  // 3. Fetch Active Class Sections
  useEffect(() => {
    const fetchSections = async () => {
      if (!isAuthorized) return;
      try {
        setLoading(true);

        // Step 1: ถาม Backend ว่าตอนนี้คือปี/เทอมอะไร (ตาม Logic มทร.ธัญบุรี)
        const current = await classSectionService.getCurrentSemester();

        // Step 2: ดึงกลุ่มเรียนโดยส่งปีและเทอมที่ได้ไปเป็น Filter
        const res = await classSectionService.getAll({
          page: 1,
          limit: 100,
          academic_year: current.academic_year, // ส่ง 2568
          term: current.term                    // ส่ง "2"
        });

        setSections(res.data);
      } catch (err) {
        console.error("Failed to load current sections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [isAuthorized]);

  // 4. State สำหรับ UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  // Handle Change Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  // 5. Validation Logic
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.prefixName) newErrors.prefixName = 'กรุณาเลือกคำนำหน้า';
    if (!formData.sectionId) newErrors.sectionId = 'กรุณาเลือกกลุ่มเรียน';

    if (!validateThaiName(formData.firstName)) newErrors.firstName = 'ชื่อต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiName(formData.lastName)) newErrors.lastName = 'นามสกุลต้องเป็นภาษาไทยเท่านั้น';

    if (!validateThaiPhone(formData.phone)) newErrors.phone = 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง';

    if (!validatePassword(formData.password)) newErrors.password = 'รหัสผ่านต้องมีตัวอักษรและตัวเลข (อย่างน้อย 8 ตัวอักษร)';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 6. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      // แปลง sectionId เป็น number ก่อนส่ง
      const payload = {
        ...formData,
        sectionId: Number(formData.sectionId)
      };

      await authService.register(payload as any);

      sessionStorage.removeItem('registerEmail');
      sessionStorage.removeItem('registrationToken');

      navigate('/login');

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('409')) {
        setError('อีเมลนี้ลงทะเบียนไปแล้ว กรุณาเข้าสู่ระบบ');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return null; // ไม่แสดงผลถ้าไม่มีสิทธิ์

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Global Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* --- ส่วนที่ 1: ข้อมูลส่วนตัว --- */}
      <div className="grid grid-cols-3 gap-4">
        {/* คำนำหน้า */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">คำนำหน้า</label>
          <div className="relative">
            <select
              name="prefixName"
              value={formData.prefixName}
              onChange={handleChange}
              className={`w-full px-2 py-2 bg-gray-50 text-gray-700 text-sm border rounded-xl appearance-none focus:ring-2 focus:outline-none transition-all ${fieldErrors.prefixName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
                }`}
              disabled={loading}
            >
              <option value="">-- เลือก --</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          {fieldErrors.prefixName && <p className="text-red-500 text-xs mt-1">{fieldErrors.prefixName}</p>}
        </div>

        {/* ชื่อจริง */}
        <div className="col-span-2">
          <Input
            label="ชื่อจริง (ภาษาไทย)"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            icon={<FiUser />}
            placeholder="ชื่อ"
            disabled={loading}
            className={fieldErrors.firstName ? 'border-red-500 focus:ring-red-200' : ''}
          />
          {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
        </div>
      </div>

      {/* นามสกุล */}
      <div>
        <Input
          label="นามสกุล (ภาษาไทย)"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          icon={<FiUser />}
          placeholder="นามสกุล"
          disabled={loading}
          className={fieldErrors.lastName ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
      </div>

      {/* --- Dropdown เลือกกลุ่มเรียน --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">รหัสกลุ่มเรียน</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiLayers />
          </div>
          <select
            name="sectionId"
            value={formData.sectionId}
            onChange={handleChange}
            disabled={loading || sections.length === 0}
            className={`w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-700 text-sm border rounded-xl appearance-none focus:ring-2 focus:outline-none transition-all ${fieldErrors.sectionId ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
              }`}
          >
            <option value="">-- เลือกกลุ่มเรียนของคุณ --</option>
            {sections.length > 0 ? (
              sections.map((sec) => (
                <option key={sec.section_id} value={sec.section_id}>
                  {sec.section_name} (เทอม {sec.term}/{sec.academic_year})
                </option>
              ))
            ) : (
              <option disabled>กำลังโหลด หรือ ไม่มีกลุ่มเรียน...</option>
            )}
          </select>

          {/* Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
        {fieldErrors.sectionId && <p className="text-red-500 text-xs mt-1">{fieldErrors.sectionId}</p>}
      </div>

      {/* เบอร์โทร */}
      <div>
        <Input
          label="เบอร์โทรศัพท์"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          icon={<FiPhone />}
          placeholder="08xxxxxxxx"
          maxLength={10}
          disabled={loading}
          className={fieldErrors.phone ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
      </div>

      {/* --- ส่วนที่ 2: รหัสผ่าน --- */}
      <div>
        <Input
          label="รหัสผ่าน"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          icon={<FiLock />}
          placeholder="อย่างน้อย 8 ตัวอักษร"
          disabled={loading}
          className={fieldErrors.password ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
      </div>

      <div>
        <Input
          label="ยืนยันรหัสผ่าน"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<FiLock />}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          disabled={loading}
          className={fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all mt-6 disabled:opacity-50"
      >
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
      </button>

    </form>
  );
};