import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export interface DeviceMultiImageUploadProps {
  label?: string;
  value?: string[];
  values?: string[];
  onChange: (filePaths: string[]) => void;
  category?: string;
  maxFiles?: number;
  className?: string;
}

export const DeviceMultiImageUpload: React.FC<DeviceMultiImageUploadProps> = ({
  label,
  value,
  values,
  onChange,
  category = 'comic_panels',
  maxFiles = 10,
  className = '',
}) => {
  const currentValues = value || values || [];
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedPaths: string[] = [];

    for (const file of files) {
      try {
        const media = await adminApi.uploadMedia(file, category);
        uploadedPaths.push(media.file_path);
      } catch (err) {
        // Fallback file reader if server not connected
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve((evt.target?.result as string) || '');
          reader.readAsDataURL(file);
        });
        if (dataUrl) uploadedPaths.push(dataUrl);
      }
    }

    onChange([...currentValues, ...uploadedPaths]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveItem = (index: number) => {
    const next = [...currentValues];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            {label}
          </label>
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            {currentValues.length} image{currentValues.length === 1 ? '' : 's'} uploaded
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={handleFilesChange}
        className="hidden"
      />

      {/* Grid of image thumbnails */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {currentValues.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative group rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-900 aspect-square overflow-hidden"
          >
            <img src={url} alt={`Panel Upload ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-black/70 text-white rounded">
              #{idx + 1}
            </span>
          </div>
        ))}

        {currentValues.length < maxFiles && (
          <button
            type="button"
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className="border-2 border-dashed border-slate-300 dark:border-zinc-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center bg-slate-50/50 dark:bg-zinc-950/40 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer group"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 mt-1">
                  Upload Image
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
        Upload images directly from your computer. Supported: <span className="font-semibold text-slate-600 dark:text-zinc-400">PNG, JPG, JPEG, WEBP, SVG</span>
      </p>
    </div>
  );
};
