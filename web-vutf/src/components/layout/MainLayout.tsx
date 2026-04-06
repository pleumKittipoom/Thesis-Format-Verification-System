// src/layouts/MainLayout.tsx
import { useState, useRef, useEffect } from 'react'; 
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; 
import { Sidebar, STUDENT_MENU, INSTRUCTOR_MENU, ADMIN_MENU } from './Sidebar';
import { Header } from './Header';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiChevronDown } from 'react-icons/fi'; 
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext'; 
import { NotificationBell } from '@/components/features/notifications/NotificationBell'; 

export const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme(); 
    const { user, logout } = useAuth(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // --- State & Logic สำหรับ Profile Dropdown บนมือถือ ---
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const displayName = user?.firstName 
        ? `${user.firstName}` 
        : user?.email?.split('@')[0] || 'User';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
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
    // ----------------------------------------------------

    const getPageTitle = (path: string) => {
        const allMenus = [...STUDENT_MENU, ...INSTRUCTOR_MENU, ...ADMIN_MENU];
        const found = allMenus.find(menu => menu.path === path);
        return found ? found.label : 'Thesis Review';
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-200">

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64 relative">

                {/* --- Mobile Header --- */}
                <div className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 flex-none transition-colors relative z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-400 p-1">
                            <FiMenu size={24} />
                        </button>
                        <span className="text-lg font-bold text-gray-800 dark:text-white">Thesis Review</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                        >
                            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>

                        <NotificationBell />

                        <div className="relative ml-1" ref={profileRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-1 focus:outline-none"
                            >
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff914d&color=fff&bold=true`} 
                                    alt="Profile" 
                                    className="w-8 h-8 rounded-full object-cover border border-orange-100 dark:border-gray-600"
                                />
                                <FiChevronDown className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} size={16} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-1">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{displayName}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <FiLogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* --- Desktop Header --- */}
                <div className="hidden md:block flex-none relative z-40">
                    <Header title={getPageTitle(location.pathname)} />
                </div>

                {/* --- เนื้อหาหลัก --- */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth dark:bg-gray-900 transition-colors">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};