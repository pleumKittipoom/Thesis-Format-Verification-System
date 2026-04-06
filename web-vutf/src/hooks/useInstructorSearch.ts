// src/hooks/useInstructorSearch.ts
// Hook สำหรับค้นหาอาจารย์แบบ debounced

import { useState, useEffect, useCallback } from 'react';
import { InstructorInfo } from '@/types/thesis';
import { api } from '@/services/api';
import { useDebounce } from './useDebounce';

interface UseInstructorSearchOptions {
    /** Delay ก่อนค้นหา (ms) - default: 300 */
    debounceMs?: number;
    /** จำนวนตัวอักษรขั้นต่ำก่อนค้นหา - default: 2 */
    minChars?: number;
}

interface UseInstructorSearchReturn {
    /** คำค้นหาปัจจุบัน */
    query: string;
    /** ฟังก์ชันเปลี่ยนคำค้นหา */
    setQuery: (query: string) => void;
    /** ผลลัพธ์การค้นหา */
    results: InstructorInfo[];
    /** สถานะกำลังโหลด */
    isLoading: boolean;
    /** Error message (ถ้ามี) */
    error: string | null;
    /** ล้างผลการค้นหา */
    clearResults: () => void;
}

/**
 * useInstructorSearch - Hook สำหรับค้นหาอาจารย์
 * 
 * Features:
 * - Debounced search เพื่อลด API calls
 * - Loading และ Error states
 * - ล้างผลการค้นหาได้
 * 
 * @example
 * const { query, setQuery, results, isLoading } = useInstructorSearch();
 * 
 * <input value={query} onChange={(e) => setQuery(e.target.value)} />
 * {results.map(instructor => <InstructorOption key={instructor.instructor_uuid} {...instructor} />)}
 */
export function useInstructorSearch(
    options: UseInstructorSearchOptions = {}
): UseInstructorSearchReturn {
    const { debounceMs = 300, minChars = 2 } = options;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<InstructorInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ใช้ debounce เพื่อไม่ให้ยิง API ทุกครั้งที่พิมพ์
    const debouncedQuery = useDebounce(query, debounceMs);

    // ฟังก์ชันค้นหา
    const searchInstructors = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < minChars) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get<{ data: InstructorInfo[] }>('/instructors', {
                search: searchQuery,
                limit: 10,
            });
            setResults(response.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหา');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [minChars]);

    // Effect เมื่อ debounced query เปลี่ยน
    useEffect(() => {
        searchInstructors(debouncedQuery);
    }, [debouncedQuery, searchInstructors]);

    // ล้างผลการค้นหา
    const clearResults = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        clearResults,
    };
}

export default useInstructorSearch;
