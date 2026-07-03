import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, code, language, description } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Nenhum código foi fornecido para explicação.' }, { status: 400 });
    }

    const ai = getGeminiClient();

    const prompt = `Por favor, explique em detalhes como o seguinte snippet de código funciona.
    
Título: ${title || 'Sem título'}
Linguagem: ${language || 'Desconhecida'}
Descrição do Autor: ${description || 'Nenhuma descrição'}

Código:
\`\`\`${language || ''}
${code}
\`\`\`

Estruture a explicação em português do Brasil da seguinte forma:
1. **Visão Geral**: O que este código faz em uma linguagem simples e direta.
2. **Explicação Passo a Passo (Linha por Linha)**: Divida a lógica de execução e explique o que as principais construções fazem.
3. **Padrões de Projeto ou Recursos da Linguagem Utilizados**: Quais recursos avançados (como corrotinas, tipagem, decorators, closures) estão sendo empregados e por que são úteis aqui.
4. **Casos de Uso Comuns**: Em que cenários práticos este código deve ser aplicado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um mestre da guilda rúnica técnica de Asgard, ensinando com clareza, paciência e jargão simples a arte da programação prática para guerreiros novatos. Fale de forma didática e motivadora em português brasileiro.",
        temperature: 0.3
      }
    });

    const text = response.text;
    return NextResponse.json({ explanation: text });
  } catch (error: any) {
    console.error("Erro na explicação de código do Gemini:", error);
    return NextResponse.json({ error: error.message || 'Erro ao processar a explicação' }, { status: 500 });
  }
}
