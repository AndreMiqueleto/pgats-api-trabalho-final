// Bibliotecas
const request = require('supertest');
const { expect,use } = require('chai');

const chaiExclude = require('chai-exclude');
const { test } = require('mocha/lib/mocha');
use(chaiExclude)

require('dotenv').config();

// Testes
describe('Sale', () => {
    describe('POST /products/register', () => {
         it("Testando o cadastro com sucesso de um produto - Status Code 201", async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/products/register')
                .send({
                    name: "Fundamentos de API",
                    type: "Curso",
                    price: 150.00
                });
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('message', "Product registered");
        });

        
        const testesDeErrosCadastroProdutos = require('../fixture/requisicoes/cadastro/postProdutosFaltandoCampos.json');
        testesDeErrosCadastroProdutos.forEach(testeCadastro => {
            it(`Testando a regra relacionada a ${testeCadastro.nomeDoTeste} - Status Code 400`, async () => {
                const resposta = await request(process.env.BASE_URL_REST)
                    .post('/products/register')
                    .send(testeCadastro.postProdutos);

                expect(resposta.status).to.equal(testeCadastro.statusCode);
                expect(resposta.body).to.have.property('error', testeCadastro.mensagemEsperada);
            });
        })

    });

    describe('POST /sales', () => {
        beforeEach(async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json');

            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/users/login')
                .send(postLogin);

            token = respostaLogin.body.token;
        });

        it("Testando uma venda com sucesso de um produto - Status Code 200", async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/sales')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productName: "Fundamentos de API",
                    quantity: 1,
                    coupon: "DIADOPROGRAMADOR"
                });
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('price', 127.5);
            expect(resposta.body).to.have.property('message', "Sale completed with coupon DIADOPROGRAMADOR applied!");       
        });

        const testesDeErrosVendaProdutos = require('../fixture/requisicoes/vendas/postVendasErros.json');
        testesDeErrosVendaProdutos.forEach(testeVenda => {
            it(`Testando a regra relacionada a ${testeVenda.nomeDoTeste} - Status Code ${testeVenda.statusCode} `, async () => {
                const resposta = await request(process.env.BASE_URL_REST)
                    .post('/sales')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testeVenda.postVendas);

                expect(resposta.status).to.equal(testeVenda.statusCode);
                expect(resposta.body).to.have.property('error', testeVenda.mensagemEsperada);
            });
        })

    });
    describe('GET /products', () => {
        it('Listando produtos', async() => {
                const resposta = await request(process.env.BASE_URL_REST)
                .get('/products')

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array');
            expect(resposta.body).to.deep.include({ name: 'Algoritmos', type: 'Livro', price: 300 }, 
                                                  { name: 'Fundamentos de API', type: 'Livro', price: 150 },    
                                                  { name: 'Node JS', type: 'Curso', price: 150 }
                                                  );
        })

    });
});