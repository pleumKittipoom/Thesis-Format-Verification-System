// src/types/track-thesis.ts

// --- Filter Params ---
export interface TrackThesisFilterParams {
    inspectionId?: number;
    search?: string;
    roundNumber?: number;
    academicYear?: string;
    term?: string;
    courseType?: string;
    advisorName?: string;
    page?: number;
    limit?: number;
    verificationStatus?: string;
    submissionStatus?: string;
    sortOrder?: 'DESC' | 'ASC' | string;
}

export interface MemberInfo {
    studentCode: string;
    name: string;
    email?: string;
    role: string; // 'owner' | 'member'
}

export interface AdvisorInfo {
    name: string;
    role: string;
}

export interface MissingRoundInfo {
    inspectionId: number;
    roundLabel: string;
    deadline: string;
    isOverdue: boolean;
}

// --- Main Data Objects ---

export interface UnsubmittedGroup {
    groupId: string;
    thesisCode: string;
    thesisTitleTh: string;
    thesisTitleEn: string;
    courseType: string;

    groupMembers: MemberInfo[]; 
    advisors: AdvisorInfo[];

    missingContext: MissingRoundInfo;
}

export interface SubmittedGroup {
    groupId: string;
    thesisCode: string;
    thesisTitleTh: string;
    thesisTitleEn: string;
    courseType: string;

    groupMembers: MemberInfo[];
    advisors: AdvisorInfo[];

    submission: {
        id: number;
        status: string;
        submittedAt: string;
        fileName: string;
        fileUrl: string;
        downloadUrl?: string;
        fileSize?: number; 
        mimeType?: string;
    };

    context?: {
        inspectionId: number;
        roundLabel: string;
        deadline: string;
        isOverdue: boolean;
    };
}

// --- API Response Wrapper ---
export interface TrackThesisResponse {
    success: boolean;
    data: UnsubmittedGroup[] | SubmittedGroup[]; 
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
        stats?: {
            totalGroups: number;
            submitted: number;
            unsubmitted: number;
        };
        filterContext?: any;
    };
}

export interface ActiveRoundOption {
    id: number;
    label: string;
    value: number;
    type: string;
    deadline: string;
}