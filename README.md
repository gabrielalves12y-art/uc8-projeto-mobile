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