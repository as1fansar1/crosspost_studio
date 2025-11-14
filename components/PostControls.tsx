
import React from 'react';

interface PostControlsProps {
    onPost: () => void;
    canPost: boolean;
    isPosting: boolean;
}

const PostControls: React.FC<PostControlsProps> = ({ onPost, canPost, isPosting }) => {
    return (
        <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 py-3 px-4">
            <div className="container mx-auto flex justify-end">
                <button
                    onClick={onPost}
                    disabled={!canPost}
                    className="px-8 py-3 bg-cyan-600 text-white font-bold text-lg rounded-full hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                >
                    {isPosting ? 'Posting...' : 'Post All'}
                </button>
            </div>
        </div>
    );
};

export default PostControls;
