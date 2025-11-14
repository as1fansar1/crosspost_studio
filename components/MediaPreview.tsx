
import React from 'react';
import { MediaFile } from '../types';

interface MediaPreviewProps {
  mediaFiles: MediaFile[];
  onRemove: (id: string) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaFiles, onRemove }) => {
  if (mediaFiles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {mediaFiles.map(mf => (
        <div key={mf.id} className="relative aspect-square group">
          {mf.file.type.startsWith('image/') ? (
            <img src={mf.previewUrl} alt={mf.file.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <video src={mf.previewUrl} className="w-full h-full object-cover rounded-lg" />
          )}
          <button
            onClick={() => onRemove(mf.id)}
            className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove media"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
