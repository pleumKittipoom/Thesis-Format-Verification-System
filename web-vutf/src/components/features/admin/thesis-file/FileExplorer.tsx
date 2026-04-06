// src/components/features/admin/thesis-file/FileExplorer.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { thesisFileService } from '@/services/thesis-file.service';
import { FileNode } from '@/types/thesis-file';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileGridItem } from './FileGridItem';
import { FileTableView } from './FileTableView';
import { FiLoader, FiAlertCircle, FiFolderMinus, FiSearch, FiX, FiDownload } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv, FaFile } from 'react-icons/fa6';
import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';
import { FileStatsHeader } from './FileStatsHeader';
import { RecentActivityDrawer } from './RecentActivityDrawer';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

export const FileExplorer = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPath = searchParams.get('path') || '';

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [nodes, setNodes] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [previewNode, setPreviewNode] = useState<FileNode | null>(null);
    const [previewMode, setPreviewMode] = useState<'PDF' | 'VALIDATOR'>('PDF');

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);

    // --- Helpers ---
    const formatSize = (bytes: number | undefined) => {
        if (!bytes && bytes !== 0) return 'Unknown';
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileType = (fileName: string) => (fileName?.split('.').pop()?.toUpperCase() || 'FILE');

    const getFileIcon = (fileName: string) => {
        const type = getFileType(fileName);
        if (type === 'PDF') return <FaFilePdf size={24} />;
        if (type === 'CSV') return <FaFileCsv size={24} />;
        return <FaFile size={24} />;
    };

    const getIconStyle = (fileName: string) => {
        const type = getFileType(fileName);
        if (type === 'PDF') return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        if (type === 'CSV') return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        return 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    };

    // --- API Functions ---
    const fetchFiles = async (path: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await thesisFileService.getContents(path);
            if (response && response.data) {
                setNodes(response.data);
            } else {
                setNodes([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) {
            setIsSearching(false);
            fetchFiles(currentPath);
            return;
        }
        try {
            setLoading(true);
            setIsSearching(true);
            setError(null);
            const response = await thesisFileService.searchFiles(searchQuery);
            if (response && response.data) setNodes(response.data);
            else setNodes([]);
        } catch (err) {
            setError('Search failed');
            setNodes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isSearching) {
            fetchFiles(currentPath);
        }
    }, [currentPath, isSearching]);

    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
    };

    // --- Navigation & Action Logic ---
    const handleNavigate = (nodeOrPath: FileNode | string) => {
        // ปิดเมนูทุกครั้งที่มีการนำทาง
        setActiveMenuId(null);

        if (isSearching && typeof nodeOrPath !== 'string') {
            if (nodeOrPath.type === 'FOLDER') setIsSearching(false);
        }

        if (typeof nodeOrPath === 'string') {
            setSearchParams({ path: nodeOrPath });
        } else {
            if (nodeOrPath.type === 'FOLDER') {
                setSearchParams({ path: nodeOrPath.path });
            } else if (nodeOrPath.type === 'FILE' && nodeOrPath.url) {
                const lowerName = nodeOrPath.name.toLowerCase();
                const isPdf = lowerName.endsWith('.pdf') || nodeOrPath.mimeType === 'application/pdf';
                const isCsv = lowerName.endsWith('.csv') || nodeOrPath.mimeType === 'text/csv';

                if (isPdf) {
                    setPreviewNode(nodeOrPath);
                    setPreviewMode('PDF');
                } else if (isCsv) {
                    setPreviewNode(nodeOrPath);
                    setPreviewMode('VALIDATOR');
                } else {
                    window.open(nodeOrPath.downloadUrl || nodeOrPath.url, '_blank');
                }
            }
        }
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    const onPreview = (node: FileNode) => {
        handleNavigate(node);
    };

    const onDownloadAction = (node: FileNode) => {
        handleDownload(node.downloadUrl || node.url || '');
    };

    const loadStats = async () => {
        try {
            const response = await thesisFileService.getStats();
            if (response && response.data) {
                setStats(response.data);
            } else {
                setStats(response);
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    useEffect(() => {
        loadStats(); // เรียกดึงสถิติตอนโหลดหน้าครั้งแรก
    }, []);

    const isHybridView = isSearching || (nodes.length > 0 && nodes[0].metadata?.isHybridView);

    return (
        <div className="space-y-6 relative">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Thesis File Management
                </h2>
            </div>

            <FileStatsHeader
                stats={stats}
                onOpenActivity={() => setIsActivityOpen(true)}
            />

            {/* Breadcrumb */}
            <FileBreadcrumb
                currentPath={currentPath}
                onNavigate={handleNavigate}
                // Props สำหรับ Search
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => handleSearch()}
                onClearSearch={clearSearch}
            />

            {/* Search Result Info */}
            {isSearching && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 -mt-2 mb-4 px-2">
                    <span>Results for:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                    <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600 hover:underline ml-2 text-xs">
                        (Clear)
                    </button>
                </div>
            )}

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FiLoader className="animate-spin mb-3" size={32} />
                    <p>{isSearching ? 'Searching...' : 'Loading files...'}</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-xl">
                    <FiAlertCircle size={32} className="mb-2" />
                    <p>{error}</p>
                    <button onClick={() => isSearching ? handleSearch() : fetchFiles(currentPath)} className="mt-4 underline">Retry</button>
                </div>
            ) : nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <FiFolderMinus size={48} className="mb-3 opacity-50" />
                    <p>{isSearching ? 'No results found' : 'No files found in this folder'}</p>
                </div>
            ) : (
                <>
                    {isHybridView ? (
                        <FileTableView nodes={nodes} onNavigate={handleNavigate} />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {nodes.map(node => (
                                <FileGridItem
                                    key={node.id}
                                    node={node}
                                    isMenuOpen={activeMenuId === node.id}
                                    onMenuOpen={(id) => setActiveMenuId(id)}

                                    onClick={handleNavigate}
                                    onPreview={onPreview}
                                    onDownload={onDownloadAction}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}



            {/* PREVIEW MODAL */}
            {previewNode && (
                previewMode === 'VALIDATOR' ? (
                    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                        <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative">
                            <button
                                onClick={() => setPreviewNode(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <FiX size={24} />
                            </button>

                            <ThesisValidator
                                reportFileId={Number(previewNode.id) || 0}
                                pdfUrl={previewNode.metadata?.submissionPdfUrl || ""}
                                csvUrl={previewNode.url || ""}
                                fileName={previewNode.name}
                                onClose={() => setPreviewNode(null)}
                                isReadOnly={true}
                            />
                        </div>
                    </div>
                ) : (
                    // PDF Preview
                    <PdfPreviewModal
                        url={previewNode.url || ''}
                        downloadUrl={previewNode.downloadUrl || previewNode.url || ''}
                        fileName={previewNode.name}
                        fileSize={previewNode.size}
                        onClose={() => setPreviewNode(null)}
                    />
                )
            )}

            <RecentActivityDrawer
                isOpen={isActivityOpen}
                onClose={() => setIsActivityOpen(false)}
            />
        </div>
    );
};