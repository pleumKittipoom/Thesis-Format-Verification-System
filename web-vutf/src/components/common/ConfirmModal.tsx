// src/components/common/ConfirmModal.tsx
import { FiAlertCircle, FiCheckCircle, FiX, FiLoader } from 'react-icons/fi';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
    isLoading?: boolean;
    loadingText?: string;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    type = 'info',
    isLoading = false,
    loadingText = 'กำลังดำเนินการ...',
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    const typeStyles = {
        info: {
            icon: <FiCheckCircle size={28} />,
            bg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            btn: 'bg-blue-600 hover:bg-blue-700',
        },
        success: {
            icon: <FiCheckCircle size={28} />,
            bg: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            btn: 'bg-green-600 hover:bg-green-700',
        },
        warning: {
            icon: <FiAlertCircle size={28} />,
            bg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
            btn: 'bg-amber-600 hover:bg-amber-700',
        },
        danger: {
            icon: <FiAlertCircle size={28} />,
            bg: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            btn: 'bg-red-600 hover:bg-red-700',
        },
    };

    const style = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md z-10 shadow-2xl transform transition-all scale-100 p-6 relative animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Icon and Title */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${style.bg}`}>
                        {style.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2 ${style.btn} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading && <FiLoader className="animate-spin" />}
                        {isLoading ? loadingText : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
