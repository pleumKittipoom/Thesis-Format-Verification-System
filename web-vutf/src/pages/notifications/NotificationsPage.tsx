// src/pages/notifications/NotificationsPage.tsx
import { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services/api';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { NotificationItem } from '../../components/features/notifications/NotificationItem';

export const NotificationsPage = () => {
  const [fullNotifications, setFullNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { unreadCount, markAllAsRead, markAsRead } = useNotificationSocket();

  // ดึงข้อมูลแบบเต็ม (มี Pagination)
  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/notifications?limit=50');
      setFullNotifications(res.data.items || res.data);
    } catch (error) {
      console.error('Error fetching all notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const handleMarkAll = async () => {
    await markAllAsRead();
    fetchAllNotifications();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl text-white">
              <FiBell size={24} />
            </div>
            การแจ้งเตือน
          </h1>
          <p className="text-gray-500 mt-2">คุณมีรายการที่ยังไม่ได้อ่าน {unreadCount} รายการ</p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all text-sm font-semibold"
          >
            <FiCheckCircle size={18} />
            อ่านทั้งหมดแล้ว
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">กำลังโหลดข้อมูล...</p>
          </div>
        ) : fullNotifications.length > 0 ? (
          fullNotifications.map((noti) => (
            <NotificationItem 
              key={noti.id} 
              notification={noti} 
              onClick={async (n) => {
                 if(!n.is_read) await markAsRead(n.id);
                 // ถ้ามี URL ใน data ให้ไปที่นั่นได้เลย
                 if(n.data?.url) window.location.href = n.data.url;
              }} 
            />
          ))
        ) : (
          <div className="p-20 text-center">
            <FiBell size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">ไม่มีแจ้งเตือน</h3>
            <p className="text-gray-500">คุณยังไม่มีรายการแจ้งเตือนในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};