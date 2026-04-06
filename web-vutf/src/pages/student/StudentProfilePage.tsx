import { useEffect, useState } from 'react';
import { FiUser, FiPhone, FiMail, FiBook, FiHash, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

// Services & Types
import { getStudentProfile, updateStudentProfile } from '../../services/student.service';
import { StudentProfile } from '../../types/profile.types';

// Components
import { ProfileHeader } from '../../components/features/profile/ProfileHeader';
import { InfoRow } from '../../components/features/profile/InfoRow';

export const StudentProfilePage = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับโหมดแก้ไข
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    prefixName: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getStudentProfile();
      setProfile(data);
      setFormData({
        prefixName: data.prefix_name,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    if (profile) {
      setFormData({
        prefixName: profile.prefix_name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStudentProfile(formData);
      await fetchProfile();
      setIsEditing(false);
      
      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        customClass: {
            popup: 'dark:bg-gray-800 dark:text-white'
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        customClass: {
            popup: 'dark:bg-gray-800 dark:text-white',
            title: 'dark:text-white',
            htmlContainer: 'dark:text-gray-300'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-base sm:text-sm";
  const rowClass = "flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 dark:border-gray-700 px-2 min-h-[50px] gap-1 sm:gap-0";
  const labelClass = "w-full sm:w-1/3 text-gray-500 dark:text-gray-400 font-medium text-sm flex items-center gap-2";
  const valueClass = "w-full sm:w-2/3";

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
      <ProfileHeader 
        fullName={profile.full_name}
        role="Student"
        code={profile.student_code}
        email={profile.email}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter-up">
        
        {/* ================= Card 1: ข้อมูลส่วนตัว (Inline Edit) ================= */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-4 sm:p-6 relative transition-all duration-300 ${isEditing ? 'border-blue-200 dark:border-blue-800 shadow-md ring-4 ring-blue-50/50 dark:ring-blue-900/30' : 'border-gray-100 dark:border-gray-700'}`}>
          
          {/* Header Card */}
          <div className="flex items-center justify-between mb-6 h-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiUser className="text-blue-500 dark:text-blue-400" />
              ข้อมูลส่วนตัว
            </h2>

            {isEditing ? (
              <div className="flex items-center gap-2 animate-scale-up">
                <button 
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FiX /> <span className="hidden sm:inline">ยกเลิก</span>
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                >
                  {isSaving ? '...' : <><FiCheck /> <span>บันทึก</span></>}
                </button>
              </div>
            ) : (
              <button 
                onClick={handleStartEdit}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                title="แก้ไขข้อมูล"
              >
                <FiEdit2 size={18} />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {/* 1. คำนำหน้า */}
            <div className={rowClass}>
              <div className={labelClass}>คำนำหน้า</div>
              <div className={valueClass}>
                {isEditing ? (
                  <select 
                    className={inputClass}
                    value={formData.prefixName}
                    onChange={e => setFormData({...formData, prefixName: e.target.value})}
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                  </select>
                ) : (
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">{profile.prefix_name}</span>
                )}
              </div>
            </div>

            {/* 2. ชื่อจริง */}
            <div className={rowClass}>
              <div className={labelClass}>ชื่อจริง</div>
              <div className={valueClass}>
                {isEditing ? (
                  <input 
                    type="text" 
                    className={inputClass}
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                ) : (
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">{profile.first_name}</span>
                )}
              </div>
            </div>

            {/* 3. นามสกุล */}
            <div className={rowClass}>
              <div className={labelClass}>นามสกุล</div>
              <div className={valueClass}>
                {isEditing ? (
                  <input 
                    type="text" 
                    className={inputClass}
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                ) : (
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">{profile.last_name}</span>
                )}
              </div>
            </div>

            {/* 4. เบอร์โทรศัพท์ */}
            <div className={rowClass}>
              <div className={labelClass}>
                <FiPhone className="text-blue-500 dark:text-blue-400 sm:hidden md:inline" /> เบอร์โทรศัพท์
              </div>
              <div className={valueClass}>
                {isEditing ? (
                  <input 
                    type="tel" 
                    className={inputClass}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                ) : (
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">{profile.phone}</span>
                )}
              </div>
            </div>

            {/* 5. อีเมล */}
            <div className={rowClass}>
              <div className={labelClass}>
                <FiMail className="text-blue-500 dark:text-blue-400 sm:hidden md:inline" /> อีเมล
              </div>
              <div className={valueClass}>
                <span className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-sm break-all">
                  {profile.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Card 2: ข้อมูลการศึกษา (Read Only) ================= */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 h-fit transition-colors">
          <div className="flex items-center justify-between mb-6 h-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiBook className="text-blue-500 dark:text-blue-400" />
              ข้อมูลการศึกษา
            </h2>
          </div>
          
          <div className="space-y-1">
            {/* 1. รหัสนักศึกษา */}
            <div className={rowClass}>
              <div className={labelClass}>
                 <FiHash className="text-blue-500 dark:text-blue-400 sm:hidden md:inline" /> รหัสนักศึกษา
              </div>
              <div className={valueClass}>
                <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">
                  {profile.student_code}
                </span>
              </div>
            </div>

            {/* 2. กลุ่มเรียน */}
            <div className={rowClass}>
              <div className={labelClass}>กลุ่มเรียน (Section)</div>
              <div className={valueClass}>
                <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">
                  {profile.sectionName}
                </span>
              </div>
            </div>

            {/* 3. สถานะ */}
            <div className={rowClass}>
              <div className={labelClass}>สถานะ</div>
              <div className={valueClass}>
                <span className={`px-2 py-0.5 rounded text-sm font-medium ${profile.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* 4. วันที่สมัคร */}
            <div className={rowClass}>
              <div className={labelClass}>วันที่สมัคร</div>
              <div className={valueClass}>
                <span className="text-gray-800 dark:text-gray-200 font-medium text-base sm:text-sm">
                  {new Date(profile.create_at).toLocaleDateString('th-TH')}
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};