import { IArticleRepository } from '../interfaces/IArticleRepository';
import { Article } from '../entities/Article';
import { z } from 'zod';

const CreateArticleSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres').max(100, 'O título é muito longo'),
  content: z.string().min(20, 'O conteúdo deve ter pelo menos 20 caracteres'),
  excerpt: z.string().min(10, 'O resumo deve ter pelo menos 10 caracteres').max(200, 'O resumo é muito longo'),
  category: z.string(),
  readTime: z.string().min(1, 'O tempo de leitura é obrigatório'),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string()
  }),
  tags: z.array(z.string()).min(1, 'Adicione pelo menos uma tag')
});

export class CreateArticleUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(input: unknown): Promise<Article> {
    const validatedInput = CreateArticleSchema.parse(input);
    return await this.articleRepository.create(validatedInput);
  }
}
