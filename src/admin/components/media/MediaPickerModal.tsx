import React from 'react';
import { Modal } from '../ui';
import { MediaLibrary } from './MediaLibrary';
import { MediaFile } from '../../types/admin.types';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaFiles: MediaFile[];
  onUploadFile: (file: File, category: string) => Promise<MediaFile>;
  onDeleteFile: (id: number) => Promise<boolean>;
  onSelectUrl: (url: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  mediaFiles,
  onUploadFile,
  onDeleteFile,
  onSelectUrl,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Asset from Media Library"
      subtitle="Click any asset to insert its URL directly into the field"
      maxWidth="4xl"
    >
      <MediaLibrary
        mediaFiles={mediaFiles}
        onUploadFile={onUploadFile}
        onDeleteFile={onDeleteFile}
        isPickerMode={true}
        onSelectFile={(file) => {
          onSelectUrl(file.file_path);
          onClose();
        }}
      />
    </Modal>
  );
};
