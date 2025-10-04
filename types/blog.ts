export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogAuthorInfo {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  role?: string;
  bio?: string;
  social?: Record<string, string>;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
  views: number;
  createdAt: number;
  updatedAt: number;
  category: BlogCategory;
  author: BlogAuthorInfo;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  nb: number;
  nbOnPage: number;
  currentPage: number;
  totalPages: number;
  data: BlogPost[];
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}

export interface BlogAuthorDetail extends BlogAuthorInfo {
  articleCount: number;
  articles: BlogPost[];
}

export interface AuthorResponse {
  success: boolean;
  message: string;
  data: BlogAuthorDetail;
}
