import { IArticleRepository } from '../../core/interfaces/IArticleRepository';
import { ISnippetRepository } from '../../core/interfaces/ISnippetRepository';
import { InMemoryArticleRepository } from './InMemoryArticleRepository';
import { InMemorySnippetRepository } from './InMemorySnippetRepository';
import { PrismaArticleRepository } from './PrismaArticleRepository';
import { PrismaSnippetRepository } from './PrismaSnippetRepository';

let articleRepositoryInstance: IArticleRepository | null = null;
let snippetRepositoryInstance: ISnippetRepository | null = null;

export function getArticleRepository(): IArticleRepository {
  if (!articleRepositoryInstance) {
    if (process.env.DATABASE_URL) {
      console.log('[RepositoryProvider] Utilizing Prisma PostgreSQL Database Source');
      articleRepositoryInstance = new PrismaArticleRepository();
    } else {
      console.log('[RepositoryProvider] Utilizing InMemory Mock Database Source');
      articleRepositoryInstance = new InMemoryArticleRepository();
    }
  }
  return articleRepositoryInstance;
}

export function getSnippetRepository(): ISnippetRepository {
  if (!snippetRepositoryInstance) {
    if (process.env.DATABASE_URL) {
      console.log('[RepositoryProvider] Utilizing Prisma PostgreSQL Database Source');
      snippetRepositoryInstance = new PrismaSnippetRepository();
    } else {
      console.log('[RepositoryProvider] Utilizing InMemory Mock Database Source');
      snippetRepositoryInstance = new InMemorySnippetRepository();
    }
  }
  return snippetRepositoryInstance;
}
