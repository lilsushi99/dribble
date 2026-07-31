import React, { useState } from 'react';
import { LayoutSection, MediaFile } from '../types/admin.types';
import { LayoutBuilder } from '../components/layout-builder/LayoutBuilder';
import { SectionEditorDrawer } from '../components/layout-builder/SectionEditorDrawer';
import { MediaPickerModal } from '../components/media/MediaPickerModal';

export interface LayoutBuilderPageProps {
  sections: LayoutSection[];
  onSaveSections: (sections: LayoutSection[]) => Promise<void>;
  mediaFiles: MediaFile[];
  onUploadMedia: (file: File, category: string) => Promise<MediaFile>;
  onDeleteMedia: (id: number) => Promise<boolean>;
}

export const LayoutBuilderPage: React.FC<LayoutBuilderPageProps> = ({
  sections,
  onSaveSections,
  mediaFiles,
  onUploadMedia,
  onDeleteMedia,
}) => {
  const [editingSection, setEditingSection] = useState<LayoutSection | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [onMediaSelectCallback, setOnMediaSelectCallback] = useState<((url: string) => void) | null>(null);

  const handleUpdateSingleSection = async (updated: LayoutSection) => {
    const newSections = sections.map((s) => (s.id === updated.id ? updated : s));
    await onSaveSections(newSections);
  };

  return (
    <div className="animate-in fade-in duration-200">
      <LayoutBuilder
        sections={sections}
        onSaveLayout={onSaveSections}
        onEditSection={(sec) => setEditingSection(sec)}
        onPreviewSection={(sec) => setEditingSection(sec)}
      />

      {/* Section Editor Drawer */}
      <SectionEditorDrawer
        isOpen={!!editingSection}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleUpdateSingleSection}
        onOpenMediaPicker={(callback) => {
          setOnMediaSelectCallback(() => callback);
          setIsMediaPickerOpen(true);
        }}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaFiles={mediaFiles}
        onUploadFile={onUploadMedia}
        onDeleteFile={onDeleteMedia}
        onSelectUrl={(url) => {
          if (onMediaSelectCallback) onMediaSelectCallback(url);
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
};
