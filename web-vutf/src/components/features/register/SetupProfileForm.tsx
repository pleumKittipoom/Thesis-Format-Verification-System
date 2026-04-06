// src/components/features/register/SetupProfileForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../../services/user.service';
import { classSectionService } from '../../../services/class-section.service';
import { validatePassword, validateThaiName, validateThaiPhone } from '../../../utils/validation';
import { Input } from '../../common/Input';
import { FiUser, FiPhone, FiLock, FiAlertCircle, FiLayers } from 'react-icons/fi'; 
import { ClassSection } from '../../../types/class-section';

export const SetupProfileForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // State สำหรับควบคุมการแสดงผล
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  // 4. เพิ่ม sectionId ใน State
  const [formData, setFormData] = useState({
    prefixName: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sectionId: '' 
  });

  // 5. State เก็บรายการกลุ่มเรียน
  const [sections, setSections] = useState<ClassSection[]>([]);

  // -------------------------------------------------------------------
  // 1. ตรวจสอบ Token
  // -------------------------------------------------------------------
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const status = await userService.validateInviteToken(token);

        if (status.isSetup) {
          navigate('/login', {
            state: { message: 'บัญชีนี้ถูกเปิดใช้งานไปแล้ว กรุณาเข้าสู่ระบบ', type: 'info' },
            replace: true
          });
          return;
        }

        setIsCheckingToken(false);

      } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.message || err.message;
        if (msg.includes('expired') || msg.includes('token')) {
          setError('ลิงก์คำเชิญหมดอายุ หรือไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่เพื่อขอลิงก์ใหม่');
        } else {
          setError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล: ' + msg);
        }
        setIsCheckingToken(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  // -------------------------------------------------------------------
  // 6. Fetch Class Sections (ดึงข้อมูลกลุ่มเรียน)
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchSections = async () => {
      // ดึงข้อมูลเฉพาะเมื่อ Token ผ่านแล้ว (isCheckingToken = false) และไม่มี Error
      if (isCheckingToken || error) return;

      try {
        setLoading(true);

        // ดึงปีการศึกษาและเทอมปัจจุบันจาก Backend
        const current = await classSectionService.getCurrentSemester();

        // ดึงกลุ่มเรียนโดยส่งปีและเทอมปัจจุบันเข้าไปกรอง
        const res = await classSectionService.getAll({
          page: 1,
          limit: 100,
          academic_year: current.academic_year, // เช่น 2568
          term: current.term                    // เช่น "2"
        });

        setSections(res.data);
      } catch (err) {
        console.error("Failed to load current sections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [isCheckingToken, error]);

  // -------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev: any) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.prefixName) newErrors.prefixName = 'กรุณาเลือกคำนำหน้า';
    if (!formData.sectionId) newErrors.sectionId = 'กรุณาเลือกกลุ่มเรียน';

    if (!validateThaiName(formData.firstName)) newErrors.firstName = 'ชื่อต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiName(formData.lastName)) newErrors.lastName = 'นามสกุลต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiPhone(formData.phone)) newErrors.phone = 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)';
    if (!validatePassword(formData.password)) newErrors.password = 'รหัสผ่านต้องมีตัวอักษรและตัวเลข (อย่างน้อย 8 ตัวอักษร)';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    if (!token) return;

    setLoading(true);
    try {
      // 8. ส่ง sectionId ไปพร้อมกับข้อมูลอื่น
      await userService.setupProfile({
        token: token,
        password: formData.password,
        prefixName: formData.prefixName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        sectionId: Number(formData.sectionId) // แปลงเป็นตัวเลข
      });

      navigate('/login', {
        state: {
          message: 'ตั้งค่าบัญชีสำเร็จ กรุณาเข้าสู่ระบบ',
          type: 'success'
        }
      });

    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      setError('เกิดข้อผิดพลาด: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-500">
        <svg className="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-medium">กำลังตรวจสอบสถานะบัญชี...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 border border-red-100">
          <FiAlertCircle className="shrink-0 mt-0.5" size={18} />
          <span>{error}</span>
        </div>
      )}

      {!error && (
        <>
          {/* --- ส่วนที่ 1: ข้อมูลส่วนตัว --- */}
          <div className="grid grid-cols-3 gap-4">
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
                  <option value="">เลือก</option>
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

          {/* 9. UI Dropdown กลุ่มเรียน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">รหัสกลุ่มเรียน (Class Section)</label>
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
            {fieldErrors.sectionId && <p className="text-red-500 text-xs mt-1">{fieldErrors.sectionId}</p>}
          </div>

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
              label="ตั้งรหัสผ่านใหม่"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all mt-6 disabled:opacity-50"
          >
            {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
          </button>
        </>
      )}

    </form>
  );
};