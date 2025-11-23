# 🏛️ CaçaLei

> Democratizando o acesso à informação legislativa brasileira através de IA e engajamento cidadão

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

</div>

---

## 📖 Sobre o Projeto

**CaçaLei** é uma plataforma de engajamento cívico desenvolvida durante um hackathon que transforma a maneira como cidadãos brasileiros descobrem, entendem e reagem a projetos de lei.

Integrando dados reais da **Câmara dos Deputados**, processamento de PDFs e **Inteligência Artificial**, o CaçaLei traduz linguagem jurídica complexa em resumos didáticos acessíveis, permitindo que qualquer pessoa participe do debate legislativo.

### 🎯 O Problema

- **Complexidade**: Projetos de lei usam linguagem técnica inacessível para o cidadão comum
- **Dispersão**: Informações legislativas estão fragmentadas em sites governamentais pouco intuitivos
- **Baixo Engajamento**: Falta de canais simples para cidadãos expressarem opiniões sobre leis que os afetam

### 💡 Nossa Solução

Uma plataforma moderna que:
- ✅ **Conecta-se diretamente** à API oficial da Câmara dos Deputados
- ✅ **Processa PDFs** de projetos de lei automaticamente
- ✅ **Gera resumos** em linguagem simples usando IA (Gemini)
- ✅ **Permite reações** (apoio, não apoio, confuso, impacta) e comentários
- ✅ **Apresenta vídeos explicativos** para cada projeto de lei
- ✅ **Oferece busca avançada** com Command Palette (⌘K)

---

## ✨ Funcionalidades Principais

### 🔍 Descoberta de Projetos de Lei
- Lista atualizada de PLs da Câmara dos Deputados
- Filtros por tema, localização, status e autor
- Busca com sensibilidade a acentuação e múltiplos critérios

### 🤖 Resumos com IA
Para cada projeto de lei, geramos automaticamente:
- **Resumo Técnico**: 1-2 linhas objetivas
- **Resumo Didático**: 100-200 palavras em português simples e acessível

### 📹 Vídeos Explicativos
- Player customizado com controles completos
- Interface mobile-first responsiva

### 💬 Engajamento Cidadão
- **4 tipos de reação**: Apoio, Não apoio, Não entendi, Impacta
- Sistema de comentários com respostas aninhadas
- Upvotes em comentários e respostas
- UI otimista para feedback instantâneo

### ⚡ Experiência Premium
- Micro-interações em cada elemento
- Transições suaves (150-300ms)
- Design minimalista sem sombras desnecessárias
- Keyboard shortcuts (⌘K para busca)
- Animações que respeitam `prefers-reduced-motion`

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - App Router, React Server Components
- **[React 19](https://react.dev/)** - React Compiler habilitado
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estrita
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Estilização moderna
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis (Radix UI)
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[Phosphor Icons](https://phosphoricons.com/)** - Iconografia

### Backend & Dados
- **[Supabase](https://supabase.com/)** - PostgreSQL + Auth + Row Level Security
- **[Câmara dos Deputados API](https://dadosabertos.camara.leg.br/)** - Dados legislativos oficiais
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - Extração de texto de PDFs

### Developer Experience
- **[Biome](https://biomejs.dev/)** - Linting + Formatação (substitui ESLint/Prettier)
- **[nuqs](https://nuqs.dev/)** - Gerenciamento de estado via URL
- **[cmdk](https://cmdk.paco.me/)** - Command Palette
- **[class-variance-authority](https://cva.style/)** - Variantes de componentes

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **npm** ou **pnpm**
- Conta no [Supabase](https://supabase.com/)
- Chave de API do [Google AI Studio](https://aistudio.google.com/app/apikey) (Gemini)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/pedrogagodev/caca-lei.git
cd caca-lei
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Google Gemini AI
GEMINI_API_KEY=sua-chave-gemini-aqui
```

4. **Configure o banco de dados Supabase**

Execute o script SQL no Supabase SQL Editor:
```bash
# Copie o conteúdo de schema.sql e execute no painel do Supabase
# Isso criará todas as tabelas, triggers, RLS policies e views
```

5. **Rode o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Estrutura do Projeto

```
caca-lei/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Homepage (lista de leis)
│   │   ├── layout.tsx           # Layout raiz
│   │   ├── actions/             # Server Actions
│   │   │   ├── bills.ts         # Sync com API da Câmara
│   │   │   ├── auth.ts          # Autenticação
│   │   │   ├── comments.ts      # CRUD de comentários
│   │   │   └── bill-reactions.ts # Reações
│   │   ├── leis/
│   │   │   ├── _components/     # Componentes compartilhados
│   │   │   └── [id]/            # Página de detalhes da lei
│   │   │       ├── page.tsx     # Processa PDF + gera resumos
│   │   │       ├── _components/ # Componentes específicos
│   │   │       └── _hooks/      # Hooks customizados
│   │   ├── login/
│   │   └── register/            # Fluxo de cadastro
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── layout/              # Navbar, search palette
│   ├── lib/
│   │   ├── camara-api.ts        # Cliente da API da Câmara
│   │   ├── gemini-summarizer.ts # Geração de resumos com IA
│   │   └── pdf-parser.ts        # Extração de texto de PDFs
│   ├── types/                   # Definições de tipos
│   ├── constants/               # Constantes da aplicação
│   ├── contexts/                # React Contexts
│   ├── hooks/                   # Custom hooks globais
│   └── supabase/                # Configuração Supabase
├── public/                      # Assets estáticos
├── schema.sql                   # Schema completo do banco
├── CLAUDE.md                    # Guia de desenvolvimento (22KB!)
└── README.md                    # Este arquivo
```

---

## 🔄 Como Funciona

### 1. Integração com a API da Câmara

```typescript
// src/lib/camara-api.ts
export async function fetchBills() {
  const response = await fetch(
    'https://dadosabertos.camara.leg.br/api/v2/proposicoes?siglaTipo=PL&ordem=DESC&ordenarPor=id',
    { next: { revalidate: 300 } } // Cache de 5 minutos
  );
  // Transforma dados da API para formato interno
}
```

### 2. Geração de Resumos com IA

Quando um usuário acessa uma lei:

```typescript
// src/app/leis/[id]/page.tsx
1. Busca metadados da lei na API da Câmara
2. Se houver PDF, baixa e extrai o texto completo
3. Envia para Gemini gerar dois resumos em paralelo:
   - Resumo técnico (1-2 linhas)
   - Resumo didático (100-200 palavras simples)
4. Salva no banco de dados (fire-and-forget)
5. Exibe imediatamente na UI
```

### 3. Sistema de Reações

- Usuário clica em uma reação (Apoio, Não apoio, etc.)
- UI atualiza **otimisticamente** (sem esperar servidor)
- Server Action persiste no banco
- Se falhar, reverte a mudança na UI

### 4. Busca Global (⌘K)

- Command Palette com atalho de teclado
- Busca em: título, código, resumo, tags, localização, autor
- Normaliza acentos para melhor matching
- Navegação por teclado completa

---

## 📊 Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuário (nome, avatar, localização, idade, ocupação) |
| `bills` | Projetos de lei (título, código, status, resumos, PDF, tags) |
| `bill_reactions` | Reações dos usuários (apoio, não-apoio, confuso, impacta) |
| `bill_comments` | Comentários principais |
| `bill_comment_replies` | Respostas aninhadas |
| `comment_upvotes` | Upvotes em comentários |

### Features do Banco

- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Triggers automáticos** para contagem de votos e criação de perfis
- ✅ **Views otimizadas** (`bills_with_stats`, `comments_with_users`)
- ✅ **Funções auxiliares** (`has_user_voted()`, `get_top_bills()`)
- ✅ **Tracking geográfico** de votos por cidade/estado

---

## 🎨 Design & UX

Este projeto segue princípios rigorosos de design documentados em `CLAUDE.md`:

### Princípios
- ✅ Todas as interações têm 6 estados (default, hover, focus, active, loading, disabled)
- ✅ Transições suaves (150-300ms) com easing apropriado
- ✅ Sem sombras (exceto overlays flutuantes)
- ✅ Bordas semi-transparentes para hierarquia visual
- ✅ Micro-interações em ícones, botões e cards
- ✅ Respeita `prefers-reduced-motion`
- ✅ Targets de toque ≥44px no mobile
- ✅ Acessibilidade total via teclado

### Exemplo de Micro-Interação

```tsx
// Botão com 6 estados
<button className="
  transition-all duration-200
  hover:scale-[1.02] hover:bg-primary/90
  focus-visible:ring-2 focus-visible:ring-primary
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  aria-busy:animate-pulse
">
```

---

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (localhost:3000)
npm run build        # Build de produção
npm start            # Servidor de produção
npm run lint         # Verificação de linting (Biome)
npm run format       # Formatação de código (Biome)
```

---

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | ✅ Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ Sim |
| `GEMINI_API_KEY` | Chave da API do Google Gemini | ✅ Sim |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Este projeto foi desenvolvido para um hackathon, mas está aberto para melhorias.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Código

- **Arquivos**: `kebab-case.tsx`
- **Componentes**: `PascalCase`
- **Funções/variáveis**: `camelCase`
- **Tipos**: `PascalCase` com sufixo `.types.ts`
- **Server Actions**: Sempre em `src/app/actions/`
- **Linting**: Rode `npm run lint` antes de commitar

Consulte `CLAUDE.md` para o guia completo de estilo e arquitetura.

---

## 📝 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir.

---

## 👥 Equipe

Desenvolvido com ❤️ durante um hackathon por uma equipe apaixonada por democracia digital e tecnologia cívica.

---

## 📞 Contato

Dúvidas, sugestões ou feedback? Abra uma [issue](https://github.com/pedrogagodev/caca-lei/issues) no GitHub!

---

<div align="center">

**🏛️ CaçaLei - Democratizando o Acesso à Legislação Brasileira**

Feito com Next.js, React, TypeScript, Supabase & ❤️

</div>
