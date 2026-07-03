import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, code, language, description } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Nenhum código foi fornecido para revisão.' }, { status: 400 });
    }

    const ai = getGeminiClient();
    
    const prompt = `Analise o seguinte snippet de código enviado para o repositório Heimdall.
    
Título: ${title || 'Sem título'}
Linguagem: ${language || 'Desconhecida'}
Descrição do Autor: ${description || 'Nenhuma descrição fornecida'}

Código:
\`\`\`${language || ''}
${code}
\`\`\`

Por favor, forneça uma análise detalhada em português do Brasil estruturada exatamente assim:

1. **Veredito do Guardião**: (Aprovado / Precisa de Ajustes / Alerta de Bugs) com uma frase de introdução nobre.
2. **Escudo de Heimdall (🛡️ Segurança)**: Detalhe possíveis vulnerabilidades, riscos de segurança, injeções, vazamentos ou confirme se o código é altamente seguro.
3. **Velocidade da Bifrost (⚡ Performance)**: Avalie a complexidade de tempo/espaço (Big O) e a eficiência das operações.
4. **Estética Nórdica (❄️ Clean Code)**: Avalie a legibilidade, convenções de nomenclatura, modularidade e clareza.
5. **Código Refatorado (O Martelo de Thor)**: Forneça uma versão otimizada e limpa do código dentro de um bloco de código Markdown correto.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é Heimdall, o guardião onisciente da ponte Bifrost. Sua missão é guiar os guerreiros desenvolvedores de Midgard na criação de códigos perfeitos, seguros e velozes. Fale de forma inspiradora, técnica, respeitosa e nobre em português brasileiro.",
        temperature: 0.2
      }
    });

    const text = response.text;
    return NextResponse.json({ review: text });
  } catch (error: any) {
    console.error("Erro na revisão de código do Gemini:", error);
    return NextResponse.json({ error: error.message || 'Erro ao processar a revisão' }, { status: 500 });
  }
}
