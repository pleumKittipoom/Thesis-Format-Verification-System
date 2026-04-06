// src/components/layout/Header.tsx
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { useTheme } from '../../hooks/useTheme';
import { NotificationBell } from '../features/notifications/NotificationBell';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export const Header = ({ title, onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.firstName 
    ? `${user.firstName}` 
    : user?.email?.split('@')[0] || 'User';

  const role = user?.role || 'Guest';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-8 sticky top-0 z-[100] shadow-sm transition-colors duration-200">
      
      {/* 2. จัดกลุ่มปุ่ม Hamburger และ Title ให้อยู่ด้วยกัน */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiMenu size={24} />
        </button>

        <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white transition-colors truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>

        {/* Language Selector */}
        {/* <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
          <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 rounded-sm shadow-sm" />
          Eng (US)
        </div> */}

        {/* Notification ของจริง (ใช้งานได้ทั้งมือถือและ PC) */}
        <NotificationBell />

        {/* User Profile & Dropdown ของจริง */}
        <div className="relative flex items-center pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 md:gap-3 focus:outline-none rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff914d&color=fff&bold=true`} 
              alt="Profile" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-orange-100 dark:border-gray-600"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none truncate max-w-[150px]">
                  {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                  {role}
              </p>
            </div>
            <FiChevronDown className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50">
              <div className="md:hidden px-4 py-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 transition-colors"
              >
                <FiLogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};