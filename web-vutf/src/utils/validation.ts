// ตรวจสอบอีเมล @mail.rmutt.ac.th
export const validateRmuttEmail = (email: string): boolean => {
  const rmuttRegex = /^[a-zA-Z0-9._%+-]+@mail\.rmutt\.ac\.th$/;
  return rmuttRegex.test(email);
};

// ตรวจสอบชื่อภาษาไทย (ก-๙)
export const validateThaiName = (name: string): boolean => {
  const thaiRegex = /^[ก-๙]+$/;
  return thaiRegex.test(name);
};

// ตรวจสอบเบอร์โทร (10 หลัก, ขึ้นต้น 06, 08, 09)
export const validateThaiPhone = (phone: string): boolean => {
  const phoneRegex = /^0[689]\d{8}$/;
  return phoneRegex.test(phone);
};

// ตรวจสอบรหัสผ่าน (8 ตัว+, มีตัวอักษร + ตัวเลข)
export const validatePassword = (password: string): boolean => {
  // บังคับว่าต้องมีตัวอักษรและตัวเลข ส่วนตัวอื่นๆ (เช่น @) มีหรือไม่มีก็ได้
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};