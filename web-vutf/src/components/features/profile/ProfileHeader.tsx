// src/components/features/profile/ProfileHeader.tsx
import { FiCamera } from 'react-icons/fi';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  code: string;
  email: string | null;
  onEditImage?: () => void;
}

export const ProfileHeader = ({ fullName, role, code, email, onEditImage }: ProfileHeaderProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6 overflow-hidden animate-enter-down transition-colors">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-20 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 pt-8 md:pt-10 px-2 md:px-4">
        
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-400 dark:text-gray-500 overflow-hidden transition-colors">
             {fullName.charAt(0)}
          </div>
          
          <button 
            onClick={onEditImage}
            className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-95"
          >
            <FiCamera size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left mb-2 w-full">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words">{fullName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 text-gray-500 dark:text-gray-400 mt-2 md:mt-1 text-sm">
             <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-0.5 rounded-full font-semibold border border-blue-100 dark:border-blue-900/50 whitespace-nowrap">
               {role}
             </span>
             <span className="flex items-center gap-1 whitespace-nowrap">
               ID: {code}
             </span>
             {email && (
               <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span> 
             )}
             {email && (
               <span className="break-all">{email}</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};