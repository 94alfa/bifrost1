import { Article } from '../../core/entities/Article';
import { IArticleRepository } from '../../core/interfaces/IArticleRepository';

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'O Guardião de Memória: Rust Ownership e Borrowing Explicados',
    excerpt: 'Compreenda o sistema de gerenciamento de memória revolucionário do Rust que elimina vazamentos de memória e race conditions sem coletor de lixo.',
    content: `# O Guardião de Memória: Rust Ownership e Borrowing Explicados

O sistema de **Ownership** (propriedade) do Rust é o mecanismo central que garante a segurança de memória sem a necessidade de um Garbage Collector (coletor de lixo). Ele é imposto em tempo de compilação por um componente chamado **Borrow Checker**.

## As Três Regras de Ouro do Ownership

Para dominar o Rust, você deve seguir estas três regras básicas:

1. **Cada valor em Rust tem um proprietário (owner).**
2. **Só pode haver um proprietário por vez.**
3. **Quando o proprietário sai de escopo (scope), o valor é descartado.**

\`\`\`rust
fn main() {
    // s é o proprietário desta String
    let s = String::from("Bifrost"); 
    
    // O valor de s é movido (moved) para s2. s não é mais válido!
    let s2 = s; 
    
    // println!("{}", s); // ❌ ERRO DE COMPILAÇÃO!
    println!("{}", s2); // ✅ Funciona perfeitamente
} // s2 sai de escopo aqui, liberando a memória
\`\`\`

## Referências e Borrowing (Empréstimo)

Mover valores constantemente é ineficiente. Para resolver isso, Rust usa o conceito de **Borrowing** (empréstimos), representados por referências (\`&\`).

### Regras do Borrowing:

* Você pode ter qualquer número de referências imutáveis (\`&T\`).
* Você só pode ter **uma** referência mutável (\`&mut T\`) por vez em um determinado escopo.
* Você **não pode** misturar referências imutáveis e mutáveis no mesmo escopo ativo.

\`\`\`rust
fn main() {
    let mut data = String::from("Heimdall");
    
    let r1 = &data; // imutável
    let r2 = &data; // imutável
    println!("{} e {}", r1, r2); // ✅ OK
    
    // r1 e r2 não são mais usados após esta linha
    
    let r3 = &mut data; // ✅ OK, pois referências imutáveis anteriores saíram de escopo ativo
    r3.push_str(" Shield");
    println!("{}", r3);
}
\`\`\`

## O Impacto Prático

Este design rígido elimina inteiramente bugs clássicos como:
1. **Dangling Pointers** (ponteiros soltos)
2. **Double Free** (liberação dupla de memória)
3. **Data Races** em programação concorrente

No ecossistema **Heimdall**, o Rust é nosso aliado preferido para serviços de alta performance.`,
    category: 'Backend',
    readTime: '5 min',
    author: {
      id: 'usr-1',
      name: 'Ragnar Lodbrok',
      avatarUrl: 'https://picsum.photos/seed/ragnar/150/150'
    },
    createdAt: '2026-07-01T10:00:00.000Z',
    likes: 42,
    tags: ['Rust', 'Systems Programming', 'Memory Safety']
  },
  {
    id: 'art-2',
    title: 'Bifrost no Next.js: Otimizando Performance com Server Components',
    excerpt: 'Descubra como os React Server Components (RSC) revolucionam a forma como enviamos JavaScript para o cliente, acelerando o tempo de carregamento.',
    content: `# Bifrost no Next.js: Otimizando Performance com Server Components

Os **React Server Components (RSC)** funcionam como a ponte Bifrost no Next.js App Router, permitindo que componentes sejam renderizados diretamente no servidor e enviados ao navegador como HTML e dados estruturados e leves, sem JavaScript adicional.

## Por que usar Server Components?

Por padrão, todos os componentes dentro do Next.js App Router são Server Components. Isso traz vantagens extraordinárias para SEO, latência e tamanho dos pacotes (bundle size).

* **Zero Bundle Size:** Bibliotecas pesadas como \`marked\` ou \`date-fns\` usadas no servidor nunca são baixadas pelo navegador do usuário.
* **Acesso Direto à Infraestrutura:** Consulta direta a bancos de dados ou APIs internas sem expor chaves de segurança.
* **Segurança Reforçada:** O cliente só vê o resultado processado, protegendo a lógica de negócio crítica.

\`\`\`tsx
// app/page.tsx - Server Component por padrão!
export default async function Page() {
  const articles = await fetchArticlesFromSource(); // Busca direta!
  
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Artigos Recentes</h1>
      <div className="grid gap-4 mt-6">
        {articles.map(article => (
          <div key={article.id} className="border p-4 rounded">
            <h2>{article.title}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
\`\`\`

## Onde entra o 'use client'?

Quando você precisa de interatividade, estados (\`useState\`), efeitos de ciclo de vida (\`useEffect\`) ou APIs exclusivas do navegador (como \`window\`), declare o componente como Client Component usando a diretiva no topo do arquivo:

\`\`\`tsx
'use client';

import { useState } from 'react';

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      👍 {likes} Curtidas
    </button>
  );
}
\`\`\`

## Arquitetura Recomendada do Heimdall

Mantenha a maior parte de sua aplicação como Server Components. Empurre a interatividade para as folhas (leaf nodes) da árvore de componentes.`,
    category: 'Frontend',
    readTime: '4 min',
    author: {
      id: 'usr-2',
      name: 'Lagertha',
      avatarUrl: 'https://picsum.photos/seed/lagertha/150/150'
    },
    createdAt: '2026-07-02T14:30:00.000Z',
    likes: 35,
    tags: ['Next.js', 'React', 'Performance', 'Web Dev']
  },
  {
    id: 'art-3',
    title: 'Segurança Impenetrável: SSH Keys e Hardening de Servidores',
    excerpt: 'Aprenda a blindar seus servidores Linux desativando autenticação por senha e configurando chaves criptográficas RSA/Ed25519.',
    content: `# Segurança Impenetrável: SSH Keys e Hardening de Servidores

Manter um servidor público exposto à internet significa sofrer ataques de força bruta automatizados constantemente. A primeira linha de defesa deve ser a desativação completa do login por senha comum em favor de criptografia assimétrica de chaves públicas.

## Chaves Ed25519 vs RSA

Embora o RSA de 4096 bits ainda seja amplamente seguro, o **Ed25519** (criptografia de curva elíptica) é atualmente o padrão recomendado devido ao seu tamanho reduzido de chaves e processamento incrivelmente rápido com segurança equivalente ou superior.

### Gerando sua chave segura:

\`\`\`bash
ssh-keygen -t ed25519 -C "admin@heimdall.tech"
\`\`\`

## Hardening do SSH Daemon

Depois de copiar sua chave pública para o servidor remoto (\`ssh-copy-id\`), é vital editar as configurações do arquivo de segurança do servidor em \`/etc/ssh/sshd_config\`.

### Configurações sugeridas para máxima segurança:

\`\`\`ini
# 1. Mudar a porta padrão para evitar escaneamentos simples
Port 2222

# 2. Impedir login direto como root
PermitRootLogin no

# 3. Desativar completamente login por senha convencional
PasswordAuthentication no

# 4. Limitar o número máximo de tentativas de autenticação
MaxAuthTries 3

# 5. Desativar encaminhamento X11
X11Forwarding no
\`\`\`

Depois de alterar, teste a sintaxe do arquivo de configuração e reinicie o serviço SSH:

\`\`\`bash
sudo sshd -t
sudo systemctl restart sshd
\`\`\`

## Firewall e Fail2ban

Complemente o hardening instalando o \`fail2ban\`. Ele monitora as tentativas de login fracassadas e bloqueia o IP de origem no nível do firewall (\`iptables\` / \`ufw\`) temporariamente ou permanentemente após um limite definido de violações.`,
    category: 'Security',
    readTime: '6 min',
    author: {
      id: 'usr-3',
      name: 'Bjorn Ironside',
      avatarUrl: 'https://picsum.photos/seed/bjorn/150/150'
    },
    createdAt: '2026-07-03T08:15:00.000Z',
    likes: 58,
    tags: ['Security', 'SSH', 'Linux', 'DevOps']
  }
];

// Persistent across module imports in the Node process lifetime
let articlesStore: Article[] = [...INITIAL_ARTICLES];

export class InMemoryArticleRepository implements IArticleRepository {
  async findAll(): Promise<Article[]> {
    return articlesStore;
  }

  async findById(id: string): Promise<Article | null> {
    const article = articlesStore.find(a => a.id === id);
    return article || null;
  }

  async create(articleInput: Omit<Article, 'id' | 'createdAt' | 'likes'>): Promise<Article> {
    const newArticle: Article = {
      ...articleInput,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    articlesStore.push(newArticle);
    return newArticle;
  }

  async like(id: string): Promise<Article | null> {
    const index = articlesStore.findIndex(a => a.id === id);
    if (index === -1) return null;
    articlesStore[index] = {
      ...articlesStore[index],
      likes: articlesStore[index].likes + 1
    };
    return articlesStore[index];
  }
}
