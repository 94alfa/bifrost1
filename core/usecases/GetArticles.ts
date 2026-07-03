import { IArticleRepository } from '../interfaces/IArticleRepository';
import { Article } from '../entities/Article';

export class GetArticlesUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(): Promise<Article[]> {
    const articles = await this.articleRepository.findAll();
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
