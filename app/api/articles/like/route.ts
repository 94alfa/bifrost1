import { NextRequest, NextResponse } from 'next/server';
import { getArticleRepository } from '@/infrastructure/repositories/RepositoryProvider';

const articleRepository = getArticleRepository();

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID do artigo é obrigatório' }, { status: 400 });
    }
    const updated = await articleRepository.like(id);
    if (!updated) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 444 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao curtir artigo' }, { status: 500 });
  }
}
