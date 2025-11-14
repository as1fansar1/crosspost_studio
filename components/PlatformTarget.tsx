
import React from 'react';
import { Platform, PostStatus } from '../types';
import { ICONS } from '../constants';

interface PlatformTargetProps {
  platform: Platform;
  text: string;
  charLimit: number;
  isEnabled: boolean;
  onToggle: () => void;
  status: PostStatus;
  isAuthenticated: boolean;
}

const StatusIndicator: React.FC<{ status: PostStatus }> = ({ status }) => {
  switch (status) {
    case PostStatus.POSTING:
      return <div className="w-5 h-5 border-2 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>;
    case PostStatus.SUCCESS:
      return <div className="w-5 h-5 text-green-400">&#10003;</div>;
    case PostStatus.FAILED:
      return <div className="w-5 h-5 text-red-400">&#10007;</div>;
    default:
      return null;
  }
};

const PlatformTarget: React.FC<PlatformTargetProps> = ({
  platform,
  text,
  charLimit,
  isEnabled,
  onToggle,
  status,
  isAuthenticated,
}) => {
  const textLength = text.length;
  const isOverLimit = textLength > charLimit;
  const charColor = isOverLimit ? 'text-red-400' : 'text-gray-400';

  return (
    <div className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between transition-all ${!isAuthenticated ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        {ICONS[platform]}
        <span className="font-bold text-lg">{platform}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <StatusIndicator status={status} />
            <span className={`text-sm font-mono ${charColor}`}>
            {textLength}/{charLimit}
            </span>
        </div>
        <button
          onClick={onToggle}
          disabled={!isAuthenticated}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            isEnabled ? 'bg-cyan-600' : 'bg-gray-600'
          } ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PlatformTarget;
