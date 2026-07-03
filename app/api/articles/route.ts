import { NextRequest, NextResponse } from 'next/server';
import { InMemoryArticleRepository } from '@/infrastructure/repositories/InMemoryArticleRepository';
import { GetArticlesUseCase } from '@/core/usecases/GetArticles';
import { CreateArticleUseCase } from '@/core/usecases/CreateArticle';

// Use a single instance to share the in-memory store in Node dev server
const articleRepository = new InMemoryArticleRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const getArticles = new GetArticlesUseCase(articleRepository);
    const articles = await getArticles.execute();
    
    if (isAdmin) {
      return NextResponse.json(articles);
    } else {
      // Filter only approved articles for normal users
      const approvedArticles = articles.filter(a => a.approved === true);
      return NextResponse.json(approvedArticles);
    }
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID do artigo é obrigatório' }, { status: 400 });
    }
    const success = await articleRepository.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 444 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao deletar artigo' }, { status: 500 });
  }
}
