export type EbookGenre = 
  | 'Autoajuda'
  | 'Ficção'
  | 'Romance'
  | 'Biografia'
  | 'Espiritualidade/Religião'
  | 'Desenvolvimento Pessoal'
  | 'Negócios e Carreira'
  | 'Educação e Didático'
  | 'Filosofia e Ensaios'
  | 'Outro';

export interface EbookInput {
  title: string;
  author: string;
  genre: EbookGenre;
  chaptersCount: number;
  targetWordsPerChapter: number;
  instructions: string;
}

export interface ChapterOutline {
  chapterNumber: number;
  title: string;
  subtitle?: string;
  summary: string;
  keyPoints: string[];
}

export interface EbookOutline {
  title: string;
  subtitle: string;
  author: string;
  genre: string;
  targetAudience: string;
  synopsis: string;
  introductionOutline: string;
  chapters: ChapterOutline[];
  conclusionOutline: string;
}

export interface ChapterContent {
  chapterNumber: number;
  title: string;
  content: string; // Markdown content
  wordCount: number;
  status: 'pending' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
}

export type UserPlanType = 'test' | 'basic' | 'pro' | 'premium' | 'custom';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  planType?: UserPlanType;
  maxEbooksQuota: number;
  maxChapters?: number;
  maxWordsPerChapter?: number;
  ebooksCount: number;
  canExport?: boolean;
  createdAt: string;
  lastLoginAt: string;
  lastEbookGeneratedAt?: string;
  planExpiresAt?: string;
}

export interface EbookProject {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  input: EbookInput;
  outline?: EbookOutline;
  introduction?: string;
  chapters: ChapterContent[];
  conclusion?: string;
  coverTheme?: 'classic' | 'modern' | 'minimal' | 'spiritual' | 'dark';
}
