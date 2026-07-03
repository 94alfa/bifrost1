import { Snippet } from '../../core/entities/Snippet';
import { ISnippetRepository } from '../../core/interfaces/ISnippetRepository';

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 'snip-1',
    title: 'Retry com Backoff Exponencial em TypeScript',
    description: 'Uma função utilitária resiliente para reexecutar requisições de API com delay exponencial crescente em caso de falha.',
    code: `async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500,
  factor = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.warn(\`Tentativa falhou. Tentando novamente em \${delay}ms...\`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * factor, factor);
  }
}`,
    language: 'typescript',
    author: {
      id: 'usr-1',
      name: 'Ragnar Lodbrok',
      avatarUrl: 'https://picsum.photos/seed/ragnar/150/150'
    },
    createdAt: '2026-07-02T11:00:00.000Z',
    stars: 24
  },
  {
    id: 'snip-2',
    title: 'Limitador de Vazão Concorrente (Rate Limiter) em Go',
    description: 'Implementação idiomática em Go utilizando canais (channels) e timers para limitar o processamento concorrente.',
    code: `package main

import (
	"fmt"
	"time"
)

func main() {
	// Canal simulando 5 requisições de entrada
	requests := make(chan int, 5)
	for i := 1; i <= 5; i++ {
		requests <- i
	}
	close(requests)

	// Tic de tempo de 200 milissegundos
	limiter := time.Tick(200 * time.Millisecond)

	for req := range requests {
		<-limiter // Bloqueia até o timer tocar
		fmt.Printf("Processando requisição %d às %s\\n", req, time.Now().Format("15:04:05.000"))
	}
}`,
    language: 'go',
    author: {
      id: 'usr-2',
      name: 'Lagertha',
      avatarUrl: 'https://picsum.photos/seed/lagertha/150/150'
    },
    createdAt: '2026-07-03T09:30:00.000Z',
    stars: 18
  },
  {
    id: 'snip-3',
    title: 'Gerenciador de Transações SQL com Context Manager em Python',
    description: 'Garante que suas transações de banco de dados façam COMMIT ou ROLLBACK de forma robusta e limpa em caso de erros.',
    code: `from contextlib import contextmanager

@contextmanager
def transaction(db_connection):
    """Garante que as operações executadas no escopo sejam atômicas."""
    cursor = db_connection.cursor()
    try:
        yield cursor
        db_connection.commit()
        print("Transação realizada com sucesso!")
    except Exception as e:
        db_connection.rollback()
        print(f"Erro detectado! Rollback executado: {e}")
        raise e
    finally:
        cursor.close()

# Exemplo de uso:
# with transaction(conn) as cursor:
#     cursor.execute("INSERT INTO users (name) VALUES ('Heimdall')")
`,
    language: 'python',
    author: {
      id: 'usr-3',
      name: 'Bjorn Ironside',
      avatarUrl: 'https://picsum.photos/seed/bjorn/150/150'
    },
    createdAt: '2026-07-03T11:45:00.000Z',
    stars: 31
  }
];

let snippetsStore: Snippet[] = [...INITIAL_SNIPPETS];

export class InMemorySnippetRepository implements ISnippetRepository {
  async findAll(): Promise<Snippet[]> {
    return snippetsStore;
  }

  async findById(id: string): Promise<Snippet | null> {
    const snippet = snippetsStore.find(s => s.id === id);
    return snippet || null;
  }

  async create(snippetInput: Omit<Snippet, 'id' | 'createdAt' | 'stars'>): Promise<Snippet> {
    const newSnippet: Snippet = {
      ...snippetInput,
      id: `snip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      stars: 0
    };
    snippetsStore.push(newSnippet);
    return newSnippet;
  }

  async star(id: string): Promise<Snippet | null> {
    const index = snippetsStore.findIndex(s => s.id === id);
    if (index === -1) return null;
    snippetsStore[index] = {
      ...snippetsStore[index],
      stars: snippetsStore[index].stars + 1
    };
    return snippetsStore[index];
  }
}
