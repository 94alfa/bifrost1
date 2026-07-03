import { ISnippetRepository } from '../interfaces/ISnippetRepository';
import { Snippet } from '../entities/Snippet';
import { z } from 'zod';

const CreateSnippetSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres').max(80, 'O título é muito longo'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres').max(250, 'A descrição é muito longa'),
  code: z.string().min(5, 'O código não pode ser vazio'),
  language: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string()
  })
});

export class CreateSnippetUseCase {
  constructor(private snippetRepository: ISnippetRepository) {}

  async execute(input: unknown): Promise<Snippet> {
    const validatedInput = CreateSnippetSchema.parse(input);
    return await this.snippetRepository.create(validatedInput);
  }
}
