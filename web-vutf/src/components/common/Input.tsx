import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = '',
  type = 'text',
  ...props
}) => {
  // สร้าง State เก็บสถานะเปิด/ปิดตา
  const [showPassword, setShowPassword] = useState(false);

  // เช็คว่า Input นี้เป็น password field หรือไม่
  const isPasswordType = type === 'password';

  // ถ้าเป็น password ให้สลับ type ระหว่าง 'text' กับ 'password' ตาม state
  const currentType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4 w-full">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">

        {/* ส่วนแสดง Icon ด้านซ้าย */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}

        <input
          type={currentType}
          className={`
            w-full bg-gray-100 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 block p-3 
            outline-none transition-all
            ${icon ? 'pl-10' : 'pl-4'} 
            ${isPasswordType ? 'pr-10' : 'pr-4'}
            ${className}
          `}
          {...props}
        />

        {/* ส่วนแสดง Eye Icon ด้านขวา (แสดงเฉพาะตอน type="password") */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
          >
            {showPassword ? (
              <FiEye size={20} />
            ) : (
              <FiEyeOff size={20} />
            )}
          </button>
        )}

      </div>
    </div>
  );
};