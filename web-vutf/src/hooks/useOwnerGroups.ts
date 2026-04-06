// src/hooks/useOwnerGroups.ts
// Hook สำหรับ fetch กลุ่มที่ user เป็นสมาชิก (และเช็คสถานะ Owner)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { groupMemberService } from '@/services/group-member.service';
import { ThesisGroupStatus } from '@/types/thesis';

interface OwnerGroup {
    groupId: string;
    thesisNameTh: string;
    thesisNameEn: string;
    thesisCode: string;
    thesisStatus?: string;
    status: ThesisGroupStatus | string;
    rejection_reason?: string | null;
}

/**
 * useOwnerGroups Hook
 * * Single Responsibility: Fetch กลุ่มทั้งหมดที่ user สังกัดอยู่ และตรวจสอบว่าเป็น Owner หรือไม่
 * * Returns:
 * - groups: รายการกลุ่มทั้งหมดที่สังกัดอยู่
 * - loading: สถานะการโหลด
 * - error: ข้อความ error
 * - refresh: function สำหรับ reload
 * - isOwner: เป็น Owner ของกลุ่มใดกลุ่มหนึ่งหรือไม่
 * - hasMultipleGroups: มีกลุ่มมากกว่า 1 กลุ่มหรือไม่
 */
export function useOwnerGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<OwnerGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    const fetchOwnerGroups = useCallback(async () => {
        console.log("----------------------------------------------------- start fetchOwnerGroup ")
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch กลุ่มทั้งหมดที่เป็นสมาชิก - returns ThesisGroup[]
            const myGroups = await groupMemberService.getMyGroups();

            const allGroups: OwnerGroup[] = [];
            let userIsOwner = false;

            for (const group of myGroups) {
                // Check if current user is the creator (Owner) of this group
                // created_by can be string (user_uuid) or object { user_uuid: string }
                const creatorId = typeof group.created_by === 'object'
                    ? group.created_by?.user_uuid
                    : group.created_by;

                const checkOwner = creatorId === user.id;

                console.log('Group:', group.group_id, 'Creator:', creatorId, 'User:', user.id, 'isOwner:', checkOwner);

                // ถ้าเป็น Owner อย่างน้อย 1 กลุ่ม ให้เซ็ต flag เป็น true
                if (checkOwner) {
                    userIsOwner = true;
                }

                // Push ข้อมูลทุกกลุ่มลงไปเสมอ ไม่ต้องมี if (checkOwner) ครอบ
                allGroups.push({
                    groupId: group.group_id,
                    thesisNameTh: group.thesis?.thesis_name_th || 'ไม่มีชื่อ',
                    thesisNameEn: group.thesis?.thesis_name_en || '-',
                    thesisCode: group.thesis?.thesis_code || '-',
                    thesisStatus: group.thesis?.status,
                    status: group.status,
                    rejection_reason: group.rejection_reason,
                });
            }

            setGroups(allGroups);
            setIsOwner(userIsOwner);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการโหลดข้อมูลกลุ่ม';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchOwnerGroups();
    }, [fetchOwnerGroups]);

    return {
        groups,
        loading,
        error,
        refresh: fetchOwnerGroups,
        isOwner,
        hasMultipleGroups: groups.length > 1,
    };
}

export type { OwnerGroup };