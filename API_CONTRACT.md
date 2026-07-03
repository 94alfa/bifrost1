# Bifrost API & Architecture Contract (SOLID & Clean Architecture)

Este documento descreve o contrato de comunicação entre a equipe de **Frontend** e a equipe de **Backend** para a plataforma **Bifrost**, adotando os princípios de **Clean Architecture**, **SOLID** e integração com **Prisma & PostgreSQL**.

---

## 🏗️ Princípios de Arquitetura & SOLID Aplicados

Para garantir que o desenvolvimento das equipes flua de forma paralela e sem atrito, a aplicação segue rigorosamente os seguintes princípios:

1. **Single Responsibility Principle (SRP):** Cada rota, Use Case e repositório possui uma única responsabilidade. O roteamento HTTP do Next.js serve apenas como gatilho, os Casos de Uso executam a lógica de negócios pura, e os repositórios cuidam apenas da persistência.
2. **Open/Closed Principle (OCP):** A plataforma é aberta para extensão (ex: adicionar persistência em Firestore ou SQLite) e fechada para alteração. Novos bancos de dados podem ser suportados adicionando classes que herdam das interfaces, sem alterar a lógica de negócios dos Casos de Uso.
3. **Liskov Substitution Principle (LSP):** As classes `PrismaArticleRepository` e `InMemoryArticleRepository` são totalmente intercambiáveis em qualquer ponto em que a interface `IArticleRepository` seja exigida.
4. **Interface Segregation Principle (ISP):** Criamos interfaces pequenas e focadas nas reais necessidades de cada entidade (`IArticleRepository`, `ISnippetRepository`), evitando interfaces gerais sobrecarregadas.
5. **Dependency Inversion Principle (DIP):** As camadas de maior nível (Controllers/API e UseCases) dependem apenas das interfaces abstratas e não de implementações concretas de persistência. A resolução é feita pelo `RepositoryProvider` central.

---

## 📂 Organização do Projeto

Abaixo está o mapeamento de pastas do projeto para facilitar a atribuição de tarefas entre as equipes de Frontend e Backend:

```bash
├── prisma/
│   └── schema.prisma                # Definição do Esquema de Banco de Dados (PostgreSQL)
├── core/                            # 🚀 Domínio e Regras de Negócio (Camada Pura)
│   ├── entities/                    # Entidades de Domínio (Types e Interfaces)
│   ├── interfaces/                  # Contratos de Repositórios (Abstrações)
│   └── usecases/                    # Casos de Uso da Aplicação
├── infrastructure/                  # 💾 Implementação técnica e Infraestrutura
│   ├── db/                          # Helpers de Bancos de Dados (Instanciação do Prisma)
│   └── repositories/                # Adaptadores de Banco de Dados (InMemory & Prisma)
├── app/                             # 🌐 Camada de Delivery / Next.js
│   ├── api/                         # Endpoints REST (Controladores / API do Backend)
│   ├── globals.css                  # Estilização global e layout (Sem scrollbars ruidosos em mobile)
│   └── page.tsx                     # Interface do Usuário Principal (Frontend)
```

---

## 📡 Contrato dos Endpoints da API REST

Todas as requisições utilizam o formato **JSON** (`Content-Type: application/json`) para envio e recebimento de dados.

### 🔐 1. Autenticação

#### `POST /api/auth/login`
Autentica um usuário na plataforma Bifrost (usuário comum ou administrador).

* **Corpo da Requisição:**
  ```json
  {
    "username": "heimdall",
    "password": "sua_password_aqui"
  }
  ```
* **Respostas:**
  * **`200 OK` (Administrador):**
    ```json
    {
      "success": true,
      "username": "heindall",
      "isAdmin": true
    }
    ```
  * **`200 OK` (Usuário Comum):**
    ```json
    {
      "success": true,
      "username": "username_formatado",
      "isAdmin": false
    }
    ```
  * **`401 Unauthorized` (Senha Admin Errada):**
    ```json
    {
      "error": "Senha de administrador incorreta."
    }
    ```

---

### 📝 2. Artigos (Articles)

#### `GET /api/articles`
Retorna a lista de artigos disponíveis na plataforma Bifrost.

* **Query Parameters:**
  * `admin=true` (opcional): Se enviado, o endpoint retornará todos os artigos incluindo os pendentes de revisão. Requer nível de acesso administrador no Frontend. Se omitido, retorna apenas artigos aprovados.
* **Respostas:**
  * **`200 OK`:**
    ```json
    [
      {
        "id": "art-1",
        "title": "Configuração Prática de SSH",
        "content": "# SSH Moderno\nConteúdo markdown do artigo...",
        "excerpt": "Aprenda a proteger seus servidores de forma profissional.",
        "category": "Security",
        "readTime": "6 min read",
        "author": {
          "id": "usr-1",
          "name": "Ragnar",
          "avatarUrl": "https://picsum.photos/seed/ragnar/150/150"
        },
        "createdAt": "2026-07-03T08:15:00.000Z",
        "likes": 58,
        "tags": ["Security", "SSH", "Linux"],
        "approved": true
      }
    ]
    ```

---

#### `POST /api/articles`
Cria um novo artigo na Bifrost. Se o autor for o administrador (`heindall`), o artigo é aprovado automaticamente. Caso contrário, entra com o status `approved: false` (Pendente).

* **Corpo da Requisição:**
  ```json
  {
    "title": "Arquitetura Hexagonal",
    "excerpt": "Explicação completa sobre portas e adaptadores.",
    "content": "# Arquitetura Hexagonal\nArtigo explicando os conceitos...",
    "category": "Backend",
    "readTime": "8 min read",
    "tags": ["Architecture", "SOLID", "Clean Code"],
    "author": {
      "name": "Bjorn",
      "avatarUrl": "https://picsum.photos/seed/bjorn/150/150"
    }
  }
  ```
* **Respostas:**
  * **`201 Created`:** Retorna o artigo completo gerado, incluindo `id`, `createdAt`, `likes` e status de `approved`.
  * **`400 Bad Request`:** Erro de validação de dados.

---

#### `POST /api/articles/like`
Adiciona uma curtida (incrementa o contador de likes) a um artigo específico.

* **Corpo da Requisição:**
  ```json
  {
    "id": "art-1"
  }
  ```
* **Respostas:**
  * **`200 OK`:** Retorna o objeto do artigo atualizado.
  * **`444 No Response/Not Found`:** Artigo não encontrado.

---

#### `POST /api/articles/approve`
Aprova um artigo pendente de publicação. **Apenas acessível se o usuário logado for administrador (Heimdall).**

* **Corpo da Requisição:**
  ```json
  {
    "id": "art-1"
  }
  ```
* **Respostas:**
  * **`200 OK`:** Retorna o artigo atualizado com `approved: true`.
  * **`404 Not Found`:** Artigo não encontrado.

---

#### `DELETE /api/articles`
Remove permanentemente um artigo da Bifrost. **Permissão exclusiva de administrador (Heimdall).**

* **Query Parameters:**
  * `id=art-1` (obrigatório): O identificador único do artigo a ser removido.
* **Respostas:**
  * **`200 OK`:**
    ```json
    {
      "success": true
    }
    ```
  * **`444 Not Found`:** Artigo não encontrado.

---

### 💻 3. Fragmentos de Código (Snippets)

#### `GET /api/snippets`
Retorna a lista de todos os snippets de código cadastrados.

* **Respostas:**
  * **`200 OK`:** Retorna uma lista de snippets em ordem cronológica reversa.

---

#### `POST /api/snippets`
Cadastra um novo snippet de código compartilhado.

* **Corpo da Requisição:**
  ```json
  {
    "title": "Throttle em Javascript",
    "description": "Função para limitar a taxa de execução de scroll ou eventos.",
    "code": "function throttle(fn, wait) { ... }",
    "language": "javascript",
    "author": {
      "name": "Lagertha",
      "avatarUrl": "https://picsum.photos/seed/lagertha/150/150"
    }
  }
  ```
* **Respostas:**
  * **`201 Created`:** Retorna o objeto do snippet criado contendo `id`, `createdAt` e `stars` inicializado em `0`.

---

#### `POST /api/snippets/star`
Adiciona uma estrela (incrementa o contador de stars) a um snippet.

* **Corpo da Requisição:**
  ```json
  {
    "id": "snip-1"
  }
  ```
* **Respostas:**
  * **`200 OK`:** Retorna o snippet atualizado.
  * **`404 Not Found`:** Snippet não encontrado.

---

## 💻 Configuração do Ambiente para Desenvolvimento Integrado

Graças ao padrão **Dependency Inversion** do SOLID, as equipes podem rodar o projeto de duas formas extremamente fáceis:

### 🌟 Modo Offline / Sem Banco de Dados (Perfeito para o Frontend)
Se a variável de ambiente `DATABASE_URL` não estiver definida no arquivo `.env`, o `RepositoryProvider` alternará automaticamente para o modo **InMemory** (`InMemoryArticleRepository` e `InMemorySnippetRepository`). O frontend funcionará perfeitamente, permitindo testar fluxos de curtidas, cadastro, aprovações e exclusão em memória.

### 🗄️ Modo Integrado (Perfeito para o Backend / Produção)
Quando a equipe de Backend disponibilizar o PostgreSQL, basta preencher o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bifrost?schema=public"
```

A aplicação fará a transição automática, gravando e consultando os dados do PostgreSQL de forma segura e imediata, sem que nenhuma linha de código do Frontend precise ser alterada!
