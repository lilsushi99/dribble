import React from 'react';
import { MediaFile } from '../types/admin.types';
import { MediaLibrary } from '../components/media/MediaLibrary';

export interface MediaLibraryPageProps {
  mediaFiles: MediaFile[];
  onUploadMedia: (file: File, category: string) => Promise<MediaFile>;
  onDeleteMedia: (id: number) => Promise<boolean>;
}

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({
  mediaFiles,
  onUploadMedia,
  onDeleteMedia,
}) => {
  return (
    <div className="animate-in fade-in duration-200">
      <MediaLibrary
        mediaFiles={mediaFiles}
        onUploadFile={onUploadMedia}
        onDeleteFile={onDeleteMedia}
      />
    </div>
  );
};
