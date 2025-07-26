export interface BlogAuthor {
  id: number;
  lastname: string;
  firstname: string;
  emailAddress: string;
  phoneNumber: string;
  accountStatus: string;
  isMainSuperAdmin: boolean;
  right: any; 
  loginCounter: number;
  wants2FAuth: boolean;
  code2FAuth: string;
  code2FAuthExpiresAt: number;
  passwordResetCode: string;
  passwordResetCodeExpiresAt: number;
  lastSeenAt: number | null;
  createdBy: number | null;
  lastUpdatedBy: number | null;
  photo: string | null; 
  createdAt: number;
  updatedAt: number;
}

export interface BlogImage {
  createdAt: number;
  updatedAt: number;
  id: number;
  slug: string;
  reference: string;
  url: string;
  type: string;
  status: string;
  file: {
    uploadMime: string;
    uploadFd: string;
    size: number;
  };
  createdBy: number;
  lastUpdatedBy: number;
}

export interface BlogPost {
  createdAt: number;
  updatedAt: number;
  id: number;
  author: string; 
  title: string;
  object: string; 
  content: string;
  reads: number;
  status: string;
  createdBy: BlogAuthor;
  lastUpdatedBy: BlogAuthor;
  image: BlogImage;
}

export interface BlogsResponse {
  nb: number;
  data: BlogPost[];
}
