# E-commerce Livros e Cursos API

## Descrição
API para vendas de livros e cursos, com autenticação JWT, regras de negócio, documentação Swagger e interface GraphQL via Apollo Server.

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install express apollo-server-express jsonwebtoken swagger-ui-express
   ```

## Como rodar a API REST

```bash
node server.js
```
Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Como rodar a API GraphQL

```bash
cd graphql
node server.js
```
Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Endpoints REST

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login (retorna JWT)
- `POST /products/register` — Registro de produto
- `GET /products` — Listagem de produtos
- `POST /sales` — Realizar venda (autenticado via Bearer Token)

## Regras de Negócio
- Login e senha obrigatórios
- Não permite usuários duplicados
- Venda máxima de 3 itens iguais por usuário
- Cupom `DIADOPROGRAMADOR`: 15% de desconto
- Cupom `AULATOPJULIAO`: 50% de desconto
- Banco de dados em memória

## GraphQL
- Mutations protegidas por JWT para vendas
- Estrutura separada em `/graphql`

## Testes
Para testes automatizados, importe o `app.js` sem o método `listen()`.

## Estrutura de Pastas
```
/controllers
/services
/models
/graphql/
  /controllers
  /services
  /models
```

## Dependências
- express
- apollo-server-express
- jsonwebtoken
- swagger-ui-express

## Observações
- Não há persistência em banco de dados, apenas em memória.
- Para autenticação, utilize o token JWT retornado no login.
