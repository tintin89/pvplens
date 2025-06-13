// General application types

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AppConfig {
  apiBaseUrl: string;
  defaultRegion: string;
  defaultRealm: string;
  clientId: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
    card: string;
  };
}

export type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn';

export type PvpBracketType = '2v2' | '3v3' | 'rbg' | 'shuffle';

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
  children?: NavigationItem[];
}
