
// ===============================================
// SITE INFO
// ===============================================
export interface SiteInfo {
  id: string;
  title: string;
  message: string;
  targetSites: string[]; // Ex: ['all', 'pgs']
  displayType: 'banner' | 'modal' | 'popup' | 'toast';
  position: 'top' | 'bottom' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animationSettings: {
    type: 'slideDown' | string; 
    duration: number;
    autoHide: boolean;
    autoHideDelay: number;
  };
  stylesSettings: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    borderColor: string;
    fontSize: string;
    fontWeight: string;
  };
  showCloseButton: boolean;
  showDismissButton: boolean;
  linkSettings: {
    openInNewTab: boolean;
    underline: boolean;
  };
  links: Array<{ url: string; label: string }>;
  startDate?: string; 
  expirationDate?: string; 
  isActive: boolean;
  priority: number;
  createdBy: string;
  stats: {
    views: number;
    clicks: number;
    dismissals: number;
  };
  version: number;
  createdAt: string; 
  updatedAt: string; 
}


// ===============================================
// SOCIALLINKS
// ===============================================
// Backend
export interface SocialLinkApi {
  id: string;
  media: string;
  link: string;
  createdAt: number;
  updatedAt: number;
}

// Frontend
export interface SocialLink {
  name: string;
  href: string;
  icon: any;
  title?: string;
}