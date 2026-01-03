import React, { useEffect, useState } from 'react';
import { media } from '@telemetryos/sdk';
import { Folder, Image, ArrowLeft, X } from 'lucide-react';

interface MediaFolder {
    id: string;
    parentId: string;
    name: string;
    size: number;
    default: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface MediaContent {
    id: string;
    contentFolderId: string;
    contentType: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    keys: string[];
    publicUrls: string[];
    hidden: boolean;
}

interface MediaPickerProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [contents, setContents] = useState<MediaContent[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [folderHistory, setFolderHistory] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Root' }]);

    // Fetch initial folders (Root)
    useEffect(() => {
        fetchRoot();
    }, []);

    // Fetch contents when folder changes
    useEffect(() => {
        if (currentFolderId) {
            fetchFolderContents(currentFolderId);
        } else {
            // In root, we might only see folders, or we need a way to see root files if API supports it.
            // The API docs say `getAllByFolderId`. Unsure if there is a "root" folder ID.
            // Usually, `getAllFolders` returns flat list?
            // Let's assume `getAllFolders` returns all folders and we filter by parentId if needed,
            // OR the SDK handles hierarchy.
            // Re-reading docs: `getAllFolders()` returns "Array of folder objects".
            // `getAllByFolderId(folderId)` returns items.
            // It doesn't explicitly say how to get root items.
            // But let's assume we start by showing Folders from `getAllFolders`.
            // And maybe there's a convention for root.
            // For now, let's just list ALL folders in the "Root" view, since `getAllFolders` implies "all".
            setContents([]);
        }
    }, [currentFolderId]);

    const fetchRoot = async () => {
        setLoading(true);
        try {
            const allFolders = await media().getAllFolders();
            // If the API returns a flat list of all folders, we ideally want to show them.
            // We'll just show all folders for now to be safe.
            setFolders(allFolders);
        } catch (e) {
            console.error('Failed to fetch folders', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchFolderContents = async (folderId: string) => {
        setLoading(true);
        try {
            const items = await media().getAllByFolderId(folderId);
            // Filter for images/videos
            const validItems = items.filter(i =>
                i.contentType.startsWith('image/') || i.contentType.startsWith('video/')
            );
            setContents(validItems);
        } catch (e) {
            console.error('Failed to fetch contents', e);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = (folder: MediaFolder) => {
        setCurrentFolderId(folder.id);
        setFolderHistory([...folderHistory, { id: folder.id, name: folder.name }]);
    };

    const handleBack = () => {
        if (folderHistory.length <= 1) return;
        const newHistory = [...folderHistory];
        newHistory.pop();
        const prev = newHistory[newHistory.length - 1];
        setFolderHistory(newHistory);
        setCurrentFolderId(prev.id);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: '#2a2a2a',
                width: '100%',
                maxWidth: '800px',
                height: '80vh',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                color: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #444',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#333'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {folderHistory.length > 1 && (
                            <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <ArrowLeft />
                            </button>
                        )}
                        <h3 style={{ margin: 0 }}>{folderHistory[folderHistory.length - 1].name}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                        <X />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '1rem',
                    alignContent: 'start'
                }}>
                    {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>Loading...</div>}

                    {!loading && !currentFolderId && folders.map(folder => (
                        <div
                            key={folder.id}
                            onClick={() => handleFolderClick(folder)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: '#3a3a3a',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4a4a4a'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#3a3a3a'}
                        >
                            <Folder size={48} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.9rem', textAlign: 'center', wordBreak: 'break-word' }}>{folder.name}</div>
                        </div>
                    ))}

                    {!loading && currentFolderId && contents.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', opacity: 0.5 }}>This folder is empty</div>
                    )}

                    {!loading && currentFolderId && contents.map(item => (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item.publicUrls[0])}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                background: '#3a3a3a',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4a4a4a'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#3a3a3a'}
                        >
                            <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={item.thumbnailUrl || item.publicUrls[0]}
                                    alt={item.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ fontSize: '0.8rem', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
