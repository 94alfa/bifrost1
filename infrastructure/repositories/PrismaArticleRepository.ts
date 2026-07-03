import { Article } from '../../core/entities/Article';
import { IArticleRepository } from '../../core/interfaces/IArticleRepository';
import prisma from '../db/prisma';

export class PrismaArticleRepository implements IArticleRepository {
  private mapToEntity(prismaArticle: any): Article {
    return {
      id: prismaArticle.id,
      title: prismaArticle.title,
      content: prismaArticle.content,
      excerpt: prismaArticle.excerpt,
      category: prismaArticle.category,
      readTime: prismaArticle.readTime,
      createdAt: prismaArticle.createdAt.toISOString(),
      likes: prismaArticle.likes,
      tags: prismaArticle.tags,
      approved: prismaArticle.approved,
      author: {
        id: prismaArticle.author.id,
        name: prismaArticle.author.name,
        avatarUrl: prismaArticle.author.avatarUrl
      }
    };
  }

  async findAll(): Promise<Article[]> {
    const prismaArticles = await prisma.article.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    return prismaArticles.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Article | null> {
    const prismaArticle = await prisma.article.findFirst({
      where: { id },
      include: { author: true }
    });
    if (!prismaArticle) return null;
    return this.mapToEntity(prismaArticle);
  }

  async create(articleInput: Omit<Article, 'id' | 'createdAt' | 'likes'>): Promise<Article> {
    const dbUser = await prisma.user.upsert({
      where: { name: articleInput.author.name },
      update: { avatarUrl: articleInput.author.avatarUrl },
      create: {
        name: articleInput.author.name,
        avatarUrl: articleInput.author.avatarUrl
      }
    });

    const isAdmin = articleInput.author.name === 'heindall';

    const prismaArticle = await prisma.article.create({
      data: {
        title: articleInput.title,
        content: articleInput.content,
        excerpt: articleInput.excerpt,
        category: articleInput.category,
        readTime: articleInput.readTime,
        tags: articleInput.tags,
        approved: isAdmin,
        authorId: dbUser.id
      },
      include: { author: true }
    });

    return this.mapToEntity(prismaArticle);
  }

  async like(id: string): Promise<Article | null> {
    try {
      const prismaArticle = await prisma.article.update({
        where: { id },
        data: {
          likes: {
            increment: 1
          }
        },
        include: { author: true }
      });
      return this.mapToEntity(prismaArticle);
    } catch {
      return null;
    }
  }

  async approve(id: string): Promise<Article | null> {
    try {
      const prismaArticle = await prisma.article.update({
        where: { id },
        data: {
          approved: true
        },
        include: { author: true }
      });
      return this.mapToEntity(prismaArticle);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.article.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
}
