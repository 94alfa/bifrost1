import { NextRequest, NextResponse } from 'next/server';
import { InMemoryArticleRepository } from '@/infrastructure/repositories/InMemoryArticleRepository';

const articleRepository = new InMemoryArticleRepository();

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID do artigo é obrigatório' }, { status: 400 });
    }
    const updated = await articleRepository.approve(id);
    if (!updated) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao aprovar artigo' }, { status: 500 });
  }
}
