
import React from 'react';
import { Platform } from './types';

export const CHAR_LIMITS: { [key in Platform]: number } = {
  [Platform.X]: 280,
  [Platform.Threads]: 500,
};

export const ICONS = {
  [Platform.X]: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  [Platform.Threads]: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.98 16.5c-2.76 0-5-2.24-5-5s2.24-5 5-5h2.27c1.48 0 2.75.85 3.38 2.13.13.26.19.55.19.85 0 .97-.78 1.75-1.75 1.75s-1.75-.78-1.75-1.75c0-.1-.01-.2-.03-.3-.2-.53-.7-.88-1.24-.88H9.98c-1.65 0-3 1.35-3 3s1.35 3 3 3h4.27c.54 0 1.04-.35 1.24-.88.02-.1.03-.2.03-.3 0-.97.78-1.75 1.75-1.75s1.75.78 1.75 1.75c0 .3-.06.59-.19.85-.63 1.28-1.9 2.13-3.38 2.13H9.98z"/>
    </svg>
  ),
};
