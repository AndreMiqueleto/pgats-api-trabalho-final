# E-commerce Livros e Cursos API

## Descrição
API para vendas de livros e cursos, com autenticação JWT, regras de negócio, documentação Swagger e interface GraphQL via Apollo Server. O banco de dados é em memória, ideal para testes automatizados.

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install express apollo-server-express jsonwebtoken swagger-ui-express
   ```

## Como rodar a API REST

```bash
npm run start-rest
```
Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Como rodar a API GraphQL

```bash
npm run start-graphql
```
Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Como rodar ambas simultaneamente

```bash
npm start
```

## Endpoints REST

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login (retorna JWT)
- `POST /products/register` — Registro de produto
- `GET /products` — Listagem de produtos
- `POST /sales` — Realizar venda (autenticado via Bearer Token)

## Interface GraphQL

- Mutations e Queries para registro, login, produtos e vendas
- Mutations de venda exigem autenticação JWT
- Estrutura separada em `/graphql`

## Regras de Negócio
- Login e senha obrigatórios
- Não permite usuários duplicados
- Venda máxima de 3 itens iguais por usuário
- Cupom `DIADOPROGRAMADOR`: 15% de desconto
- Cupom `AULATOPJULIAO`: 50% de desconto
- Cupom inválido retorna erro
- Mensagem diferenciada para venda com cupom aplicado
- Banco de dados em memória

## Testes Automatizados
- Testes com Mocha, Chai, Supertest e Mochawesome
- Scripts disponíveis em `package.json` para rodar testes REST e GraphQL:
  - `npm test` — Executa todos os testes
  - `npm run test-controller-rest` — Testa controllers REST
  - `npm run test-controller-graphql` — Testa controllers GraphQL
  - `npm run test-external-rest` — Testa endpoints REST
  - `npm run test-external-graphql` — Testa endpoints GraphQL

## Estrutura de Pastas
```
/controllers
/services
/models
/graphql/
  /controllers
  /services
  /models
/test/
  /rest/
    /controller
    /external
    /fixture
  /graphql/
    /controller
    /external
    /fixture
```

## Dependências
- express
- apollo-server-express
- jsonwebtoken
- swagger-ui-express
- dotenv

### DevDependencies
- mocha
- chai
- chai-exclude
- mochawesome
- sinon
- supertest
- concurrently

## Observações
- Não há persistência em banco de dados, apenas em memória.
- Para autenticação, utilize o token JWT retornado no login.
- O projeto está pronto para testes automatizados e integração contínua.
- Para variáveis de ambiente, utilize o arquivo `.env`.

## Exemplo de uso REST
```bash
curl -X POST http://localhost:3000/users/register -H "Content-Type: application/json" -d '{"username":"user1","password":"123"}'
curl -X POST http://localhost:3000/users/login -H "Content-Type: application/json" -d '{"username":"user1","password":"123"}'
curl -X POST http://localhost:3000/products/register -H "Content-Type: application/json" -d '{"name":"Livro A","type":"livro","price":100}'
curl -X POST http://localhost:3000/sales -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"productName":"Livro A","quantity":1,"coupon":"DIADOPROGRAMADOR"}'
```

## Exemplo de Mutation GraphQL
```graphql
mutation {
  registerUser(username: "user1", password: "123")
}
mutation {
  login(username: "user1", password: "123")
}
mutation {
  registerProduct(name: "Livro A", type: "livro", price: 100)
}
mutation {
  sell(productName: "Livro A", quantity: 1, coupon: "DIADOPROGRAMADOR") {
    username
    productName
    quantity
    price
    message
  }
}
```
