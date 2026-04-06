// src/components/features/admin/thesis-file/FileBreadcrumb.tsx
import { FiHome, FiChevronRight, FiSearch, FiX } from 'react-icons/fi';

interface FileBreadcrumbProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onClearSearch: () => void;
}

export const FileBreadcrumb = ({ 
    currentPath, 
    onNavigate,
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    onClearSearch
}: FileBreadcrumbProps) => {
    
    const parts = currentPath ? currentPath.split('/').filter(Boolean) : [];

    const formatSegment = (part: string, index: number, allParts: string[]) => {
        const root = allParts[0];
        if (root === 'WIP') {
            if (index === 2) return `Semester ${part}`;
            if (index === 4) return `Round ${part}`;
            if (index === 7 && allParts[6] === 'REPORT') return `Attempt ${part}`;
        }
        return part;
    };

    return (
        // Container 
        <div className="flex flex-col md:flex-row gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
            
            {/* Breadcrumb Navigation */}
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-nowrap px-3 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors custom-scrollbar">
                <button 
                    onClick={() => onNavigate('')}
                    className="hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                    <FiHome size={16} />
                </button>
                
                {parts.map((part, index) => {
                    const fullPath = parts.slice(0, index + 1).join('/');
                    const isLast = index === parts.length - 1;
                    const displayName = formatSegment(part, index, parts);

                    return (
                        <div key={fullPath} className="flex items-center gap-2 shrink-0">
                            <FiChevronRight size={14} className="text-gray-400" />
                            <button
                                onClick={() => !isLast && onNavigate(fullPath)}
                                disabled={isLast}
                                className={`font-medium transition-colors cursor-pointer ${
                                    isLast 
                                        ? 'text-gray-900 dark:text-white cursor-default font-bold' 
                                        : 'text-gray-500 hover:text-blue-600 dark:text-gray-400'
                                }`}
                            >
                                {displayName}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* เส้นคั่นแนวตั้ง (Visible on Desktop) */}
            <div className="hidden md:block w-[1px] bg-gray-200 dark:bg-gray-700 my-1"></div>

            {/* Search Box */}
            <form 
                onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
                className="relative w-full md:w-72 shrink-0 group"
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search title, code, or student name..."
                    className="pl-10 pr-8 py-1.5 w-full text-sm border-transparent bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-md outline-none transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                    <button 
                        type="button" 
                        onClick={onClearSearch} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                        <FiX size={14} />
                    </button>
                )}
            </form>
        </div>
    );
};