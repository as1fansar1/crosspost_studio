export enum Platform {
  X = 'X',
  Threads = 'Threads',
}

export enum PostStatus {
  IDLE = 'IDLE',
  POSTING = 'POSTING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface User {
  name: string;
  handle: string;
  avatar: string;
}

export interface AuthSession {
    user: User;
    apiKey: string;
}

export type AuthState = {
  [key in Platform]?: AuthSession;
};

export type PostStatusState = {
  [key in Platform]: PostStatus;
};

export type PostTargets = {
  [key in Platform]: boolean;
};

export interface MediaFile {
  id: string;
  file: File;
  previewUrl: string;
}