// src/types/thesis-file.ts
export interface FileNodeMetadata {
    isHybridView?: boolean;
    displayStatus?: string;
    statusColor?: 'success' | 'warning' | 'error' | 'info' | 'default';
    advisor?: string;
    owner?: string;
    code?: string;
    updatedAt?: string;
    submissionPdfUrl?: string;
}

export interface FileNode {
    id: string;
    name: string;
    type: 'FOLDER' | 'FILE';
    path: string;
    mimeType?: string;
    size?: number;
    url?: string;
    downloadUrl?: string;
    metadata?: FileNodeMetadata;
}

export interface FileResponse {
    success: boolean;
    data: FileNode[];
}