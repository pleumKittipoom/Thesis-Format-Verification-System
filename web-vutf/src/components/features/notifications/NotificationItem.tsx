// src/components/features/notifications/NotificationItem.tsx
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { FiFileText, FiUsers, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { NotificationData } from '../../../hooks/useNotificationSocket';

interface Props {
  notification: NotificationData;
  onClick: (notification: NotificationData) => void;
}

export const NotificationItem = ({ notification, onClick }: Props) => {
  // เลือก Icon ตามประเภท
  const getIcon = (type: string) => {
    switch (type) {
      case 'submission_status': return <FiFileText className="text-blue-500" />;
      case 'group_invite': return <FiUsers className="text-green-500" />;
      case 'new_comment': return <FiMessageSquare className="text-orange-500" />;
      default: return <FiInfo className="text-gray-500" />;
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 flex gap-3 items-start
        ${notification.is_read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-800/50'}
      `}
    >
      <div className="mt-1 flex-shrink-0">
        {getIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${notification.is_read ? 'text-gray-900 dark:text-gray-100' : 'text-blue-700 dark:text-blue-300'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {format(new Date(notification.created_at), 'd MMM yyyy HH:mm', { locale: th })}
        </p>
      </div>
      {!notification.is_read && (
        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
      )}
    </div>
  );
};