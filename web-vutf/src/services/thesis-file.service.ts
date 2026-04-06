// src/services/thesis-file.service.ts
import { api } from './api';
import { FileResponse } from '../types/thesis-file';

export const thesisFileService = {
    getContents: async (path: string = '') => {
        return await api.get<FileResponse>('/thesis-files/browse', { path });
    },

    searchFiles: async (query: string) => {
        return await api.get<FileResponse>('/thesis-files/search', { q: query });
    },

    downloadZip: async (path: string) => {
        const blob = await api.getBlob('/thesis-files/download-zip', { path });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const folderName = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '_') || 'download';
        
        link.setAttribute('download', `${folderName}.zip`);

        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    getStats: async () => {
        return await api.get<any>('/thesis-files/stats');
    }
};