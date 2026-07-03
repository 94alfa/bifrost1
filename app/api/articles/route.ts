import { NextRequest, NextResponse } from 'next/server';
import { InMemoryArticleRepository } from '@/infrastructure/repositories/InMemoryArticleRepository';
import { GetArticlesUseCase } from '@/core/usecases/GetArticles';
import { CreateArticleUseCase } from '@/core/usecases/CreateArticle';

// Use a single instance to share the in-memory store in Node dev server
const articleRepository = new InMemoryArticleRepository();

export async function GET() {
  try {
    const getArticles = new GetArticlesUseCase(articleRepository);
    const articles = await getArticles.execute();
    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao buscar artigos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createArticle = new CreateArticleUseCase(articleRepository);
    const newArticle = await createArticle.execute(body);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar artigo' }, { status: 400 });
  }
}
