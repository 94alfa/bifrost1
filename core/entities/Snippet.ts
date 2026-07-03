export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string; // e.g., "typescript", "javascript", "python", "go", "rust"
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string; // ISO string
  stars: number;
}
