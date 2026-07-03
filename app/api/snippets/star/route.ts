import { NextRequest, NextResponse } from 'next/server';
import { getSnippetRepository } from '@/infrastructure/repositories/RepositoryProvider';

const snippetRepository = getSnippetRepository();

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID do snippet é obrigatório' }, { status: 400 });
    }
    const updated = await snippetRepository.star(id);
    if (!updated) {
      return NextResponse.json({ error: 'Snippet não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao favoritar snippet' }, { status: 500 });
  }
}
