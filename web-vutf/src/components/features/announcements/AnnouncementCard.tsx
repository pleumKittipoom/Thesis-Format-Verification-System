// src/components/features/announcements/AnnouncementCard.tsx
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Announcement } from '../../../types/announcement'; 
import { useAuth } from '../../../contexts/AuthContext';

interface Props {
  data: Announcement;
  onEdit: (data: Announcement) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementCard = ({ data, onEdit, onDelete }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      {data.imgBase64 ? (
        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img 
            src={data.imgBase64} 
            alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-2 bg-blue-500 w-full" />
      )}

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 mb-2" title={data.title}>
          {data.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <FiCalendar />
          <span>
            {new Date(data.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1 break-words">
          {data.description}
        </p>

        {/* Action Buttons (Admin Only) */}
        {isAdmin && (
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <button 
              onClick={() => onEdit(data)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(data.announceId)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};