import { ISnippetRepository } from '../interfaces/ISnippetRepository';
import { Snippet } from '../entities/Snippet';

export class GetSnippetsUseCase {
  constructor(private snippetRepository: ISnippetRepository) {}

  async execute(): Promise<Snippet[]> {
    const snippets = await this.snippetRepository.findAll();
    return snippets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
