import { Snippet } from '../entities/Snippet';

export interface ISnippetRepository {
  findAll(): Promise<Snippet[]>;
  findById(id: string): Promise<Snippet | null>;
  create(snippet: Omit<Snippet, 'id' | 'createdAt' | 'stars'>): Promise<Snippet>;
  star(id: string): Promise<Snippet | null>;
}
