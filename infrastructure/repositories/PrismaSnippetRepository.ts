import { Snippet } from '../../core/entities/Snippet';
import { ISnippetRepository } from '../../core/interfaces/ISnippetRepository';
import prisma from '../db/prisma';

export class PrismaSnippetRepository implements ISnippetRepository {
  private mapToEntity(prismaSnippet: any): Snippet {
    return {
      id: prismaSnippet.id,
      title: prismaSnippet.title,
      description: prismaSnippet.description,
      code: prismaSnippet.code,
      language: prismaSnippet.language,
      createdAt: prismaSnippet.createdAt.toISOString(),
      stars: prismaSnippet.stars,
      author: {
        id: prismaSnippet.author.id,
        name: prismaSnippet.author.name,
        avatarUrl: prismaSnippet.author.avatarUrl
      }
    };
  }

  async findAll(): Promise<Snippet[]> {
    const prismaSnippets = await prisma.snippet.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    return prismaSnippets.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Snippet | null> {
    const prismaSnippet = await prisma.snippet.findFirst({
      where: { id },
      include: { author: true }
    });
    if (!prismaSnippet) return null;
    return this.mapToEntity(prismaSnippet);
  }

  async create(snippetInput: Omit<Snippet, 'id' | 'createdAt' | 'stars'>): Promise<Snippet> {
    const dbUser = await prisma.user.upsert({
      where: { name: snippetInput.author.name },
      update: { avatarUrl: snippetInput.author.avatarUrl },
      create: {
        name: snippetInput.author.name,
        avatarUrl: snippetInput.author.avatarUrl
      }
    });

    const prismaSnippet = await prisma.snippet.create({
      data: {
        title: snippetInput.title,
        description: snippetInput.description,
        code: snippetInput.code,
        language: snippetInput.language,
        authorId: dbUser.id
      },
      include: { author: true }
    });

    return this.mapToEntity(prismaSnippet);
  }

  async star(id: string): Promise<Snippet | null> {
    try {
      const prismaSnippet = await prisma.snippet.update({
        where: { id },
        data: {
          stars: {
            increment: 1
          }
        },
        include: { author: true }
      });
      return this.mapToEntity(prismaSnippet);
    } catch {
      return null;
    }
  }
}
