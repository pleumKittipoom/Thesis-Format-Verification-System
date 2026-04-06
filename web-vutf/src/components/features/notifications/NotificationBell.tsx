// src/components/features/notifications/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotificationSocket, NotificationData } from '../../../hooks/useNotificationSocket';
import { NotificationItem } from './NotificationItem';
import { useAuth } from '../../../contexts/AuthContext';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationSocket();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (notification: NotificationData) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (notification.data?.url) {
      navigate(notification.data.url);
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    if (user?.role) {
      navigate(`/${user.role}/notifications`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all focus:outline-none"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 px-1 transform translate-x-1/4 -translate-y-1/4">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="
            absolute right-0 mt-2 
            w-[320px] md:w-96 
            bg-white dark:bg-[#1a202c]
            rounded-xl shadow-2xl 
            border border-gray-200 dark:border-gray-600 
            z-[50] 
            overflow-hidden animate-fade-in-down
          "
        >
          {/* Header ของ Dropdown */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 font-medium"
              >
                <FiCheck /> Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar relative z-[10000]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <FiBell size={32} className="mb-2 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((noti) => (
                <NotificationItem
                  key={noti.id}
                  notification={noti}
                  onClick={handleItemClick}
                />
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center bg-white dark:bg-[#1a202c]">
            <button
              className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors w-full py-2"
              onClick={handleViewAll}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};