# uc8-projeto-mobile

Aplicativo mobile da UC8, por Emerson Gabriel. Recorte do sistema Gerenciamento-de-Pedidos, da UC5. O recorte (entidades e telas) entra aqui no encontro 3.
uc8-projeto-mobile

## Sistema de origem

O sistema original é o Gerenciamentos de pedidos desenvolvido na UC5, uma aplicação desktop em Electron, Vite e TS para gerenciar os pedidos de um estabelecimentos X com produtos e funcionários predefinidos.

## Types
Pedido - Id, Mesa, Atendente, Cliente, Itens, CriadoEm;
---------------------------------------------------------
Produto - Id, nome, categoria, valorUnitario;
---------------------------------------------------------
Funcionário - Id, nome, cargo;
---------------------------------------------------------

## Entidades

Lista de pedidos - Demonstra os pedidos já realizados, com descrição, mesa, status, cliente, atendentes, valor e produtos;

Novo pedido - Formulário para criar um pedido;

Funcionários: Lista de funcionários presente no local de criar pedidos;

Produtos: Disponivel no formulário de criação de novos pedidos.

O que fica de fora

Fica de fora a alteração de valores no mobile, o dashboard de pedidos e o filtro, sendo possivel ver somente os pedidos diários.

## Banco de dados (Neon Postgres)

O app **não** conecta direto ao Postgres (a string de conexão ficaria exposta dentro do app). Ele consome uma pequena API em `servidor/`, que fala com o Neon:

```
App (Expo)  --HTTP-->  servidor/ (Node + Express)  --SQL-->  Neon Postgres
```

Tabelas: `funcionarios`, `produtos`, `pedidos` e `itens_pedido` (ver `servidor/schema.sql`).

### Como rodar

1. **API** (em `servidor/`):
   ```bash
   cd servidor
   npm install
   cp .env.example .env      # cole a connection string do Neon em DATABASE_URL
   npm run migrar            # cria as tabelas, carrega o catálogo e 4 pedidos de exemplo
   npm start                 # sobe em http://localhost:3000
   ```
   Para criar as tabelas sem os pedidos de exemplo: `npm run migrar -- --sem-demonstracao`.

2. **App** (na raiz):
   ```bash
   cp .env.example .env      # ajuste EXPO_PUBLIC_API_URL
   npm install
   npx expo start
   ```