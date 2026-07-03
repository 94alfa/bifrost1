import { NextRequest, NextResponse } from 'next/server';
import { getSnippetRepository } from '@/infrastructure/repositories/RepositoryProvider';
import { GetSnippetsUseCase } from '@/core/usecases/GetSnippets';
import { CreateSnippetUseCase } from '@/core/usecases/CreateSnippet';

const snippetRepository = getSnippetRepository();

export async function GET() {
  try {
    const getSnippets = new GetSnippetsUseCase(snippetRepository);
    const snippets = await getSnippets.execute();
    return NextResponse.json(snippets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao buscar snippets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createSnippet = new CreateSnippetUseCase(snippetRepository);
    const newSnippet = await createSnippet.execute(body);
    return NextResponse.json(newSnippet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar snippet' }, { status: 400 });
  }
}
