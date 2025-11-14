import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AuthState, MediaFile, Platform, PostStatus, PostStatusState, PostTargets, User } from './types';
import { CHAR_LIMITS } from './constants';
import Header from './components/Header';
import Composer from './components/Composer';
import PlatformTarget from './components/PlatformTarget';
import PostControls from './components/PostControls';

const MOCK_USERS: { [key in Platform]: User } = {
  [Platform.X]: { name: 'React Dev', handle: '@reactdev', avatar: 'https://picsum.photos/seed/x_user/40/40' },
  [Platform.Threads]: { name: 'React Developer', handle: 'react.dev', avatar: 'https://picsum.photos/seed/threads_user/40/40' },
};

export default function App() {
  const [auth, setAuth] = useState<AuthState>({});
  const [postText, setPostText] = useState<string>('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [postStatus, setPostStatus] = useState<PostStatusState>({
    [Platform.X]: PostStatus.IDLE,
    [Platform.Threads]: PostStatus.IDLE,
  });
  const [postTargets, setPostTargets] = useState<PostTargets>({
    [Platform.X]: true,
    [Platform.Threads]: true,
  });

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'x-auth-success' && event.data?.payload?.apiKey) {
        setAuth(prev => ({
          ...prev,
          [Platform.X]: {
            user: MOCK_USERS[Platform.X],
            apiKey: event.data.payload.apiKey,
          }
        }));
        setPostTargets(prev => ({ ...prev, [Platform.X]: true }));
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const handleThreadsLogin = useCallback(() => {
    const apiKey = window.prompt(`Please enter your API Key for ${Platform.Threads}.\nFor this demo, you can use a Gemini API key.`);
    if (apiKey && apiKey.trim() !== '') {
        setAuth(prev => ({ 
            ...prev, 
            [Platform.Threads]: { 
                user: MOCK_USERS[Platform.Threads],
                apiKey: apiKey.trim(),
            } 
        }));
    } else {
        alert('Login failed: A valid API Key is required.');
    }
  }, []);

  const handleXLogin = useCallback(() => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
        '/auth/x.html',
        'x-auth',
        `width=${width},height=${height},left=${left},top=${top}`
    );
  }, []);

  const handleLogout = useCallback((platform: Platform) => {
    setAuth(prev => {
      const newAuth = { ...prev };
      delete newAuth[platform];
      return newAuth;
    });
    setPostTargets(prev => ({ ...prev, [platform]: false }));
  }, []);

  const handleToggleTarget = useCallback((platform: Platform) => {
    setPostTargets(prev => ({ ...prev, [platform]: !prev[platform] }));
  }, []);

  const handlePost = useCallback(async () => {
    const targets = Object.entries(postTargets)
      .filter(([, isTargeted]) => isTargeted)
      .map(([platform]) => platform as Platform);

    if (targets.length === 0) return;

    setPostStatus(prev => {
      const newStatus = { ...prev };
      targets.forEach(p => { newStatus[p] = PostStatus.POSTING; });
      return newStatus;
    });

    const mediaDescription = mediaFiles.length > 0
      ? `\n\n[This post includes ${mediaFiles.length} media file(s): ${mediaFiles.map(f => f.file.name).join(', ')}]`
      : '';
    const fullPostContent = `${postText}${mediaDescription}`;

    await Promise.all(targets.map(async (platform) => {
        const session = auth[platform];
        if (!session?.apiKey) {
             setPostStatus(prev => ({ ...prev, [platform]: PostStatus.FAILED }));
             return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: session.apiKey });
            
            // This simulates posting to the specific platform's API
            await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Simulate posting the following content to ${platform}:\n\n---\n${fullPostContent}\n---`,
            });

            setPostStatus(prev => ({ ...prev, [platform]: PostStatus.SUCCESS }));
        } catch (error) {
            console.error(`Failed to post to ${platform}:`, error);
            setPostStatus(prev => ({ ...prev, [platform]: PostStatus.FAILED }));
        }
    }));
    
    setTimeout(() => {
        setPostText('');
        setMediaFiles([]);
        setPostStatus({
            [Platform.X]: PostStatus.IDLE,
            [Platform.Threads]: PostStatus.IDLE,
        });
    }, 3000);

  }, [postTargets, auth, postText, mediaFiles]);
  
  const isPosting = useMemo(() => {
      return Object.values(postStatus).some(s => s === PostStatus.POSTING);
  }, [postStatus]);

  const canPost = useMemo(() => {
    if (isPosting) return false;
    const hasContent = postText.trim().length > 0 || mediaFiles.length > 0;
    if (!hasContent) return false;
    
    const targetedPlatforms = (Object.keys(postTargets) as Platform[]).filter(p => postTargets[p]);
    if (targetedPlatforms.length === 0) return false;
    
    const isAuthenticatedForTargets = targetedPlatforms.every(p => !!auth[p]?.apiKey);
    if (!isAuthenticatedForTargets) return false;
    
    const withinCharLimits = targetedPlatforms.every(p => postText.length <= CHAR_LIMITS[p]);
    if (!withinCharLimits) return false;
    
    return true;
  }, [isPosting, postText, mediaFiles, postTargets, auth]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header 
        auth={auth} 
        onThreadsLogin={handleThreadsLogin}
        onXLogin={handleXLogin}
        onLogout={handleLogout} 
      />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-300">Compose Post</h2>
          <Composer
            text={postText}
            onTextChange={setPostText}
            mediaFiles={mediaFiles}
            onMediaChange={setMediaFiles}
          />
        </div>
        <div className="lg:w-1/3 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-300">Platforms</h2>
          <div className="space-y-4">
            {(Object.keys(Platform) as Array<keyof typeof Platform>).map(key => (
              <PlatformTarget
                key={Platform[key]}
                platform={Platform[key]}
                text={postText}
                charLimit={CHAR_LIMITS[Platform[key]]}
                isEnabled={postTargets[Platform[key]]}
                onToggle={() => handleToggleTarget(Platform[key])}
                status={postStatus[Platform[key]]}
                isAuthenticated={!!auth[Platform[key]]}
              />
            ))}
          </div>
        </div>
      </main>
      <PostControls onPost={handlePost} canPost={canPost} isPosting={isPosting} />
    </div>
  );
}
