import { Article } from '../entities/Article';

export interface IArticleRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(article: Omit<Article, 'id' | 'createdAt' | 'likes'>): Promise<Article>;
  like(id: string): Promise<Article | null>;
}
