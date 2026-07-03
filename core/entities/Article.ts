export interface Article {
  id: string;
  title: string;
  content: string; // Markdown text
  excerpt: string;
  category: string; // e.g., "Frontend", "Backend", "DevOps", "Security", "AI"
  readTime: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string; // ISO string
  likes: number;
  tags: string[];
}
