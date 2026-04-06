// src/hooks/useNotificationSocket.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: string;
    data?: {
        url?: string;
        inspectionId?: number;
    };
    is_read: boolean;
    created_at: string;
}

export const useNotificationSocket = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // ใช้ useRef เก็บ Socket เพื่อไม่ให้ Re-render แล้วค่าหาย หรือ connect ซ้ำ
    const socketRef = useRef<Socket | null>(null);

    // 1. Fetch Notifications
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get<any>('/notifications/recent'); 
            const actualData = res.data?.data || res.data; 

            if (Array.isArray(actualData)) {
                setNotifications(actualData);
                setUnreadCount(actualData.filter((n: any) => !n.is_read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    }, [user]);

    // 2. เชื่อมต่อ Socket
    useEffect(() => {
        if (!user) return;

        // เรียก API ดึงข้อมูลเก่าก่อน
        fetchNotifications();

        // ถ้ามี Socket อยู่แล้วไม่ต้อง Connect ใหม่ (กัน Double Connection)
        if (socketRef.current?.connected) return;

        // ระบุ URL เต็มๆ เพื่อลดภาระ Proxy และลด Error ECONNABORTED
        // ใช้ import.meta.env.VITE_API_URL หรือ fallback เป็น localhost
        const socketUrl = 'http://localhost:3000/notifications'; 
        
        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket'],
            reconnectionAttempts: 5,
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('receive_notification', (newNoti: NotificationData) => {
            // Toast
            toast(newNoti.title, { icon: '🔔', position: 'top-right' });

            // Update State
            setNotifications((prev) => {
                const exists = prev.some(n => n.id === newNoti.id);
                if (exists) return prev;
                return [newNoti, ...prev].slice(0, 20);
            });
            setUnreadCount(prev => prev + 1);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socketRef.current = newSocket;

        // Cleanup function
        return () => {
            if (socketRef.current) {
                console.log('Disconnecting socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user, fetchNotifications]); 

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`, {});
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all', {});
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        socket: socketRef.current, 
        fetchNotifications 
    };
};