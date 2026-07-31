import React, { useState, useRef } from 'react';
import { MediaFile } from '../../types/admin.types';
import { Card, Badge, Button, Input, Modal } from '../ui';
import {
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Trash2,
  Check,
  FileImage,
  Folder,
  Eye,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';

export interface MediaLibraryProps {
  mediaFiles: MediaFile[];
  onUploadFile: (file: File, category: string) => Promise<MediaFile>;
  onDeleteFile: (id: number) => Promise<boolean>;
  onSelectFile?: (file: MediaFile) => void;
  isPickerMode?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaFiles,
  onUploadFile,
  onDeleteFile,
  onSelectFile,
  isPickerMode = false,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [activePreview, setActivePreview] = useState<MediaFile | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('general');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = [
    { id: 'all', label: 'All Assets', icon: Folder },
    { id: 'logos', label: 'Logos', icon: Folder },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'studio', label: 'Studio', icon: Folder },
    { id: 'blog', label: 'Blog', icon: Folder },
    { id: 'comic_panels', label: 'Comic Panels', icon: Folder },
    { id: 'general', label: 'General Uploads', icon: Folder },
  ];

  // Filter media files
  const filteredFiles = mediaFiles.filter((file) => {
    const matchesFolder = selectedFolder === 'all' || file.category === selectedFolder;
    const matchesQuery =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.original_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat =
      formatFilter === 'all' || file.mime_type.toLowerCase().includes(formatFilter.toLowerCase());

    return matchesFolder && matchesQuery && matchesFormat;
  });

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      await onUploadFile(files[0], uploadCategory);
    } catch (err) {
      alert('Upload failed. Please check backend connection.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyPath = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.file_path);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this media asset permanently?')) {
      await onDeleteFile(id);
      if (activePreview?.id === id) setActivePreview(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Drag Zone */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <FileImage className="w-5 h-5 text-blue-500" />
            <span>Digital Media Library</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage high-resolution logos, project renders, studio photos, and editorial SVG vectors.
          </p>
        </div>

        {/* Upload Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="general">Upload to: General</option>
            <option value="logos">Upload to: Logos</option>
            <option value="projects">Upload to: Projects</option>
            <option value="studio">Upload to: Studio</option>
            <option value="blog">Upload to: Blog</option>
            <option value="comic_panels">Upload to: Comic Panels</option>
          </select>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleDeviceUpload}
            className="hidden"
          />

          <Button
            variant="primary"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="whitespace-nowrap"
          >
            {isUploading ? 'Uploading File...' : 'Upload From Device'}
          </Button>
        </div>
      </div>

      {/* Folders Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800">
        {folders.map((f) => {
          const isActive = selectedFolder === f.id;
          const count =
            f.id === 'all'
              ? mediaFiles.length
              : mediaFiles.filter((m) => m.category === f.id).length;

          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0" />
              <span>{f.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Format Filter, and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by filename or asset title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />

          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-slate-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Formats (PNG, WEBP, SVG, JPG)</option>
            <option value="png">PNG Images</option>
            <option value="webp">WEBP Renders</option>
            <option value="jpeg">JPEG Photos</option>
            <option value="svg">SVG Vector Icons</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Items Display */}
      {filteredFiles.length === 0 ? (
        <Card className="text-center py-12">
          <FileImage className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">No media assets found</p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Try adjusting your search query or upload a file directly from your device.
          </p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              onClick={() => {
                if (isPickerMode && onSelectFile) {
                  onSelectFile(file);
                } else {
                  setActivePreview(file);
                }
              }}
              className="group p-2 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-blue-500/70 transition-all"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-zinc-800/80 mb-2 flex items-center justify-center">
                <img
                  src={file.file_path}
                  alt={file.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback for missing images
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Badge
                  variant="zinc"
                  size="sm"
                  className="absolute top-1.5 left-1.5 opacity-90 uppercase"
                >
                  {file.category}
                </Badge>
              </div>

              <div className="px-1">
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {file.original_name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                  <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                  <span className="uppercase">{file.mime_type.split('/')[1]}</span>
                </div>
              </div>

              {/* Action bar on hover */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-zinc-800/80">
                <button
                  onClick={(e) => handleCopyPath(file, e)}
                  className="p-1 rounded text-slate-400 hover:text-blue-500 transition-colors"
                  title="Copy File Path"
                >
                  {copiedId === file.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={(e) => handleDelete(file.id, e)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Folder</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  onClick={() => {
                    if (isPickerMode && onSelectFile) {
                      onSelectFile(file);
                    } else {
                      setActivePreview(file);
                    }
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 dark:border-zinc-800 shrink-0">
                      <img
                        src={file.file_path}
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-zinc-100">
                    {file.original_name}
                  </td>
                  <td className="py-2.5 px-4">
                    <Badge variant="blue" size="sm">
                      {file.category}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-4 uppercase text-slate-500 dark:text-zinc-400">
                    {file.mime_type.split('/')[1]}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-zinc-400">
                    {(file.file_size / 1024).toFixed(1)} KB
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => handleCopyPath(file, e)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                        title="Copy File Path"
                      >
                        {copiedId === file.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(file.id, e)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Asset Details Preview Modal */}
      <Modal
        isOpen={!!activePreview}
        onClose={() => setActivePreview(null)}
        title={activePreview?.original_name || 'Media Details'}
        subtitle="Asset specifications, format metrics, and file path copy"
      >
        {activePreview && (
          <div className="space-y-5">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
              <img
                src={activePreview.file_path}
                alt={activePreview.original_name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Filename</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate mt-0.5">
                  {activePreview.filename}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Folder / Category</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate mt-0.5 uppercase">
                  {activePreview.category}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">MIME Type</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate mt-0.5">
                  {activePreview.mime_type}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">File Size</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate mt-0.5">
                  {(activePreview.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase text-slate-400">File Access Path</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activePreview.file_path}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => handleCopyPath(activePreview, e)}
                  icon={copiedId === activePreview.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedId === activePreview.id ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
