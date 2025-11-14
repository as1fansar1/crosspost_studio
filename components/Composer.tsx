import React, { useCallback, useRef } from 'react';
import { MediaFile } from '../types';
import MediaPreview from './MediaPreview';

interface ComposerProps {
  text: string;
  onTextChange: (text: string) => void;
  mediaFiles: MediaFile[];
  onMediaChange: (files: MediaFile[]) => void;
}

const Composer: React.FC<ComposerProps> = ({ text, onTextChange, mediaFiles, onMediaChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // FIX: Explicitly type `file` as `File` to resolve errors where it was inferred as `unknown`.
      const newFiles = Array.from(event.target.files).map((file: File) => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      onMediaChange([...mediaFiles, ...newFiles]);
    }
  }, [mediaFiles, onMediaChange]);

  const removeMediaFile = useCallback((id: string) => {
    const fileToRemove = mediaFiles.find(mf => mf.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    onMediaChange(mediaFiles.filter(mf => mf.id !== id));
  }, [mediaFiles, onMediaChange]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4 shadow-lg">
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="What's happening?"
        className="w-full h-40 bg-transparent text-lg text-gray-200 placeholder-gray-500 focus:outline-none resize-none"
      />
      <MediaPreview mediaFiles={mediaFiles} onRemove={removeMediaFile} />
      <div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors"
        >
          Add Media
        </button>
      </div>
    </div>
  );
};

export default Composer;