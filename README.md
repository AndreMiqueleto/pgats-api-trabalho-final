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


## K6 - Conceitos Utilizados no código dos Testes de Performance

### Thresholds
O código abaixo demonstra o uso do conceito de threshold para garantir que 95% das requisições sejam respondidas em menos de 2 segundos:

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
}
Usado em `test/k6/sales.test.js`, `test/k6/registroProdutos.test.js`


### Checks
Os códigos abaixo usam o conceito de Checks, responsavel pelas validações das respostas HTTP e dos dados retornados:
```js
check(resRegister, {
  'register status 201': (r) => r.status === 201,
});
check(token, {
  'token exists': (t) => !!t,
});
check(responseSale, {
  'Venda: status deve ser igual a 200': (r) => r.status === 200
});
check(saleData, {
  'Venda: O preço da venda deve ser R$127,50': (d) => d.price === 127.50
});
```
Usado em: `test/k6/sales.test.js`, `test/k6/registroProdutos.test.js`, `test/k6/helpers/login.js`

### Helpers
Os Códigos abaixo utilizam funções utilitárias para facilitar o reuso de lógica, como exemplo: login.js e getBaseUrl.js:

```js
**login.js**
export function login(username, password) {
    const url = `${getBaseUrl()}/users/login`;
    const payload = JSON.stringify({ username, password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    check(res, {
        'login status 200': (r) => r.status === 200,
    });
    const token = res.json('token');
    return token;
}
```
Função login retorna o token que é necessário para conseguir realizar uma venda
Código armazenado em test\k6\helpers\login.js

```js
**getBaseUrl.js**
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```
Permite configurar a URL base via variável de ambiente.
Armazenado em test\k6\helpers\getBaseUrl.js

Ambos são utilizados em: `test/k6/sales.test.js`, `test/k6/registroProdutos.test.js`


### Trends
Uso da Métrica customizada para valor do checkout_duration como mostra o código abaixo:
```js
import { Trend } from 'k6/metrics';

const checkoutTrend = new Trend('checkout_duration');
const start = Date.now();
const duration = Date.now() - start;
checkoutTrend.add(duration);
```
Usado em: `test/k6/sales.test.js`

### Faker
Uso do Faker no código abaixo, onde é possível gerar os dados dinâmicamente para simular usuários reais:
```js
import faker from 'k6/x/faker';
username = faker.person.firstName() + Date.now().toString();
password = faker.internet.password();
```
Usado em: `test/k6/sales.test.js`

### Variável de Ambiente
Uso da variavel de ambiente no código abaixo, permitindo customizar a URL base dos testes:
```js
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```
Usado em: `test/k6/helpers/getBaseUrl.js`, referenciado nos testes

### Stages
Uso de Stages no código abaixo, muito util para para definir como a carga de usuários virtuais (VUs) varia ao longo do tempo durante um teste de performance
```js
stages: [
  { duration: '3s', target: 10 }, // Average
  { duration: '15s', target: 10 },// Spike
  { duration: '2s', target: 100 },// Spike
  { duration: '3s', target: 100 },// Average
  { duration: '5s', target: 10}, // Ramp down
  { duration: '5s', target:  0},  // Ramp down
],
```
Usado em: `test/k6/sales.test.js`

### Reaproveitamento de Resposta
exemplo abaixo da utilização de dados de resposta em etapas seguintes do teste:
```js
token = login(username, password);

//trecho abaixo faz o reaproveitamento do Token durante o envio do header:
    group('Realizando uma venda com sucesso', function () {

        const url = `${getBaseUrl()}/sales`;
        const payload =  JSON.stringify(
        {
            productName: 'Fundamentos de API',
            quantity: 1,
            coupon: 'DIADOPROGRAMADOR'
        });
        const params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        };
      const saleData = JSON.parse(responseSale.body);

        check(responseSale, {
            'Venda: status deve ser igual a 200': (r) => r.status === 200
        });

        check(saleData, {
            'Venda: O preço da venda deve ser R$127,50': (d) => d.price === 127.50
        });
    })
```
Usado em: `test/k6/sales.test.js`


### Uso de Token de Autenticação
Codigo abaixo mostra a autenticação de requisições usando JWT obtido via login:
```js
const params = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
};
```
Usado em: `test/k6/sales.test.js`, `test/k6/helpers/login.js`

### Data-Driven Testing
Codigo abaixo mostra o conceito de testes com base em dados externos:
```js
import { SharedArray } from 'k6/data';
const produtos = new SharedArray('produtos', function () {
  return JSON.parse(open('./data/produtos.test.data.json'));
});
const produto = produtos[(__VU - 1) % produtos.length];
```
Usado em: `test/k6/registroProdutos.test.js`

### Groups
Código abaixo mostra o uso de Groups, para organizar os testes em blocos lógicos para melhor leitura e relatórios:
```js
group('register', function () {
        username = faker.person.firstName() + Date.now().toString();
        password = faker.internet.password()

        const url = `${getBaseUrl()}/users/register`;
        const payload = JSON.stringify({ 
            username: username,
            password: password
        });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const resRegister = http.post(url, payload, params);
        //console.log(resRegister.body);
        check(resRegister, {
            'register status 201': (r) => r.status === 201,
        });
    });


    group('Fazendo login', function () {
        token = login(username, password);
        check(token, {
            'token exists': (t) => !!t,
        });
    })

```
Usado em: `test/k6/sales.test.js`
