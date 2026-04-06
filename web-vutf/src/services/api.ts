// src/services/api.ts
import { ApiResponse } from '@/types'

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // ถ้ามี URL จาก env (เช่น tunnel) ให้ต่อท้ายด้วย /api/v1
        return `${envUrl}/api/v1`;
    }
    // ถ้าไม่มี (เช่นตอน dev local) ให้ใช้ /api/v1 เพื่อวิ่งผ่าน proxy ใน vite.config.ts
    return '/api/v1';
};

const BASE_URL = getBaseUrl();

// ตัวแปรสำหรับจัดการ Concurrency (Mutex Lock)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        throw new Error(errorMessage);
    }
    return response.json();
}

const customFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const url = `${BASE_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
        }
    };
    console.log('Fetching:', url);

    let response = await fetch(url, fetchOptions);

    // ถ้าเจอ 401 และไม่ใช่ path ของ auth (เพื่อกัน loop)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {

        // กรณีที่มีคนอื่นกำลัง Refresh อยู่ -> ให้รอ (Queue)
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                // เมื่อ Refresh เสร็จแล้ว ให้ลองยิง Request เดิมซ้ำ
                return fetch(url, fetchOptions);
            }).catch((err) => {
                return Promise.reject(err);
            });
        }

        // กรณีที่ยังไม่มีใคร Refresh -> เป็นคนเริ่ม
        isRefreshing = true;

        try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });

            if (refreshResponse.ok) {
                // Refresh สำเร็จ -> ปล่อยคิวที่รออยู่ให้ทำงานต่อได้
                processQueue(null, true);

                // ยิง Request ของตัวเองซ้ำ
                response = await fetch(url, fetchOptions);
            } else {
                // Refresh ล้มเหลว -> แจ้ง Error ให้คิวที่รออยู่ทั้งหมด
                processQueue(new Error('Session expired'), null);
                // อาจจะสั่ง window.location.href = '/login' ตรงนี้ก็ได้ถ้าต้องการ Force Redirect
            }
        } catch (error) {
            processQueue(error, null);
        } finally {
            isRefreshing = false;
        }
    }

    return response;
};

const buildQueryString = (params?: Record<string, any>) => {
    if (!params) return '';
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });
    return query.toString() ? `?${query.toString()}` : '';
};

export const api = {
    get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
        const queryString = buildQueryString(params);
        const response = await customFetch(`${endpoint}${queryString}`, {
            method: 'GET',
        });
        return handleResponse(response);
    },

    post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
        const response = await customFetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    patch: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    put: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    postFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'POST',
            body: formData,
            // ไม่ต้องตั้ง Content-Type เพราะ browser จะจัดการ boundary ให้เอง
        });
        return handleResponse(response);
    },

    getBlob: async (endpoint: string, params?: Record<string, any>): Promise<Blob> => {
        const queryString = buildQueryString(params);
        const response = await customFetch(`${endpoint}${queryString}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'ดาวน์โหลดไฟล์ล้มเหลว');
        }

        return response.blob(); // รับค่าเป็น Blob ไม่ใช่ JSON
    },
}