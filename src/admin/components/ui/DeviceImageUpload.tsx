import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export interface DeviceImageUploadProps {
  label?: string;
  value?: string;
  onChange: (filePath: string) => void;
  category?: string;
  className?: string;
}

export const DeviceImageUpload: React.FC<DeviceImageUploadProps> = ({
  label,
  value,
  onChange,
  category = 'general',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const media = await adminApi.uploadMedia(file, category);
      onChange(media.file_path);
    } catch (err: any) {
      console.warn('Backend upload failed, utilizing client file reader preview:', err);
      // Fallback: read as Data URL if offline / local storage mode
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onChange(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-900 overflow-hidden p-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-zinc-950 border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center">
            <img src={value} alt="Uploaded Asset" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Uploaded from Device</span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5" title={value}>
              {value}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-zinc-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-zinc-950/40 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="text-xs font-medium text-slate-600 dark:text-zinc-300">Uploading file from device to server...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Upload From Device Only
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Supported formats: <span className="font-semibold text-slate-600 dark:text-zinc-400">PNG, JPG, JPEG, WEBP, SVG</span>
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && <p className="text-xs text-rose-500">{uploadError}</p>}
    </div>
  );
};
