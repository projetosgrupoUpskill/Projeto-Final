# 💰 Money Hub — Expense Tracker

O **Money Hub** permite ao utilizador registar, visualizar e gerir as suas transações financeiras de forma simples e intuitiva. A aplicação inclui autenticação segura, gráficos interativos, filtros avançados e suporte a dark mode.

## Link do projeto: 
https://github.com/projetosgrupoUpskill/Projeto-Final

---

## 👩‍💻 Autoras

| Nome | Número de Aluno |
|------|----------------|
| Rebeca Luiza Soares Cerqueira | 224 |
| Natália Carvalho de Pinho Joaquim | 219 |

---



## 🚀 Funcionalidades

- **Autenticação JWT** — login e registo com expiração automática de sessão e redirect para login
- **CRUD de Transações** — adicionar, editar e eliminar transações com confirmação modal
- **Categorias com ícones** — 14 categorias com ícones SVG e cores provenientes da base de dados
- **Dashboard** — resumo de saldo, receitas e despesas totais com as últimas transações
- **Página de Detalhes** — lista completa com filtros por tipo, categoria, período e pesquisa de texto
- **Gráficos interativos** — fluxo financeiro mensal e gastos por categoria (Recharts)
- **Dark Mode** — toggle de tema com persistência em localStorage
- **Moeda configurável** — formato de moeda personalizável (EUR, USD, GBP, BRL)
- **Responsivo** — menu sanduíche em mobile e layout adaptável
- **Chat Assistant** — widget de chatbot disponível em todas as páginas
- **Proteção de rotas** — páginas privadas inacessíveis sem autenticação


---

## ⚙️ Instalação e Execução

### Clonar o repositório:
```
git clone https://github.com/projetosgrupoUpskill/Projeto-Final.git
```

### Base de Dados
```bash
# Importar o schema e seeds
mysql -u root -p < moneyhub.sql
```

### Backend
```bash
cd BackEnd
npm install
# Criar ficheiro .env com:
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET
npm run dev
# Servidor disponível em http://localhost:3000
```

### Frontend
```bash
cd FrontEnd
npm install
npm run dev
# App disponível em http://localhost:5173
```

---

## 🔐 Autenticação

- Registo com nome, email e password (hash com bcrypt)
- Login devolve token JWT com expiração de 1 hora
- Token guardado em localStorage
- Verificação periódica (30s) — redirect automático para login quando expirado
- Todas as rotas da API protegidas por middleware JWT
- Erro 401 no frontend redireciona para login automaticamente

---

## 🎨 Decisões Técnicas

| Decisão | Justificação |
|---------|-------------|
| `useReducer` nos filtros | Múltiplos estados relacionados geridos numa função |
| `createPortal` nos modais | Evita problemas de z-index dentro de listas com overflow |
| `categoryIcons.js` no frontend | SVGs são assets visuais, não dados — pertencem ao frontend |
| `slug` e `color` na BD | Dados de identificação da categoria pertencem à fonte de verdade |
| `DATETIME` em vez de `DATE` | Permite ordenar transações do mesmo dia pela hora |
| React Query | Cache automático e invalidação após mutações |
| CSS Modules | Estilos encapsulados sem conflitos entre componentes |

---

## 📌 Funcionalidades Futuras

- Conversão cambial real entre moedas
- Limites de despesa por categoria com alertas
- Chat com IA integrado (endpoint já preparado)
- Exportação de relatórios em PDF
