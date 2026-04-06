// src/hooks/useStudentSearch.ts
// Hook สำหรับค้นหานักศึกษาแบบ debounced

import { useState, useEffect, useCallback } from 'react';
import { StudentInfo } from '@/types/thesis';
import { api } from '@/services/api';
import { useDebounce } from './useDebounce';

interface UseStudentSearchOptions {
    /** Delay ก่อนค้นหา (ms) - default: 300 */
    debounceMs?: number;
    /** จำนวนตัวอักษรขั้นต่ำก่อนค้นหา - default: 2 */
    minChars?: number;
}

interface UseStudentSearchReturn {
    /** คำค้นหาปัจจุบัน */
    query: string;
    /** ฟังก์ชันเปลี่ยนคำค้นหา */
    setQuery: (query: string) => void;
    /** ผลลัพธ์การค้นหา */
    results: StudentInfo[];
    /** สถานะกำลังโหลด */
    isLoading: boolean;
    /** Error message (ถ้ามี) */
    error: string | null;
    /** ล้างผลการค้นหา */
    clearResults: () => void;
}

/**
 * useStudentSearch - Hook สำหรับค้นหานักศึกษา
 * 
 * Features:
 * - Debounced search เพื่อลด API calls
 * - Loading และ Error states
 * - ล้างผลการค้นหาได้
 * 
 * @example
 * const { query, setQuery, results, isLoading } = useStudentSearch();
 * 
 * <input value={query} onChange={(e) => setQuery(e.target.value)} />
 * {results.map(student => <StudentOption key={student.student_uuid} {...student} />)}
 */
export function useStudentSearch(
    options: UseStudentSearchOptions = {}
): UseStudentSearchReturn {
    const { debounceMs = 300, minChars = 2 } = options;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StudentInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ใช้ debounce เพื่อไม่ให้ยิง API ทุกครั้งที่พิมพ์
    const debouncedQuery = useDebounce(query, debounceMs);

    // ฟังก์ชันค้นหา
    const searchStudents = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < minChars) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get<{ data: StudentInfo[] }>('/students', {
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
        searchStudents(debouncedQuery);
    }, [debouncedQuery, searchStudents]);

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

export default useStudentSearch;
