import React from 'react';
import { AuthState, Platform, AuthSession } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
  auth: AuthState;
  onThreadsLogin: () => void;
  onXLogin: () => void;
  onLogout: (platform: Platform) => void;
}

const AuthButton: React.FC<{
  platform: Platform;
  session: AuthSession | undefined;
  onLogin: () => void;
  onLogout: (platform: Platform) => void;
}> = ({ platform, session, onLogin, onLogout }) => {
  if (session) {
    const user = session.user;
    return (
      <div className="flex items-center gap-2">
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="text-xs text-gray-400">{user.handle}</p>
        </div>
        <button
          onClick={() => onLogout(platform)}
          className="ml-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
    >
      {ICONS[platform]}
      <span className="font-semibold">Login</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ auth, onThreadsLogin, onXLogin, onLogout }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">CrossPost Studio</h1>
        <div className="flex items-center gap-4">
          <AuthButton platform={Platform.Threads} session={auth.Threads} onLogin={onThreadsLogin} onLogout={onLogout} />
          <AuthButton platform={Platform.X} session={auth.X} onLogin={onXLogin} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
