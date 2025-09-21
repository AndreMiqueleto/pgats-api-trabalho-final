// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../app');

// Mock
const saleService = require('../../../services/saleService');
const productService = require('../../../services/productService');



// Testes
describe('Sale', () => {
    describe('POST /products/register', () => {

        const productServiceMock = sinon.stub(productService, 'registerProduct');

         it("Usando Mock: Testando o cadastro com sucesso de um produto - Status Code 201", async () => {
 
            productServiceMock.resolves({
                message: "Product registered"
            });

            const resposta = await request(app)
                .post('/products/register')
                .send({
                    name: "Android",
                    type: "Curso",
                    price: 150.00
                });
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('message', "Product registered");
        });

        
        const testesDeErrosCadastroProdutos = require('../fixture/requisicoes/cadastro/postProdutosFaltandoCampos.json');
        testesDeErrosCadastroProdutos.forEach(testeCadastro => {
            it(`Usando Mock: Testando a regra relacionada a ${testeCadastro.nomeDoTeste} - Status Code 400`, async () => {
              
                productServiceMock.returns(testeCadastro.mensagemEsperada);
                const resposta = await request(app)
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

            const respostaLogin = await request(app)
                .post('/users/login')
                .send(postLogin);

            token = respostaLogin.body.token;
        });

        it("Usando Mock: Testando uma venda com sucesso de um produto - Status Code 200", async () => {
            
            // Mocar apenas a função sellProduct do Service
            const saleServiceMock = sinon.stub(saleService, 'sell');
            saleServiceMock.resolves({
                price: 255, 
                message: "Sale completed with coupon DIADOPROGRAMADOR applied!"
            });

            const resposta = await request(app)
                .post('/sales')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productName: "Algoritmos",
                    quantity: 1,
                    coupon: "DIADOPROGRAMADOR"
                });
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('price', 255);
            expect(resposta.body).to.have.property('message', "Sale completed with coupon DIADOPROGRAMADOR applied!");
        });

        const testesDeErrosVendaProdutos = require('../fixture/requisicoes/vendas/postVendasErros.json');
        testesDeErrosVendaProdutos.forEach(testeVenda => {
            it(`Usando Mock: Testando a regra relacionada a ${testeVenda.nomeDoTeste} - Status Code ${testeVenda.statusCode} `, async () => {
                
                // Mocar apenas a função sellProduct do Service
                const saleServiceMock = sinon.stub(saleService, 'sellProduct');
                saleServiceMock.returns(testeVenda.mensagemEsperada);
                const resposta = await request(app)
                    .post('/sales')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testeVenda.postVendas);

                expect(resposta.status).to.equal(testeVenda.statusCode);
                expect(resposta.body).to.have.property('error', testeVenda.mensagemEsperada);
            });
        })

        

    });
    afterEach(() => {
            // Reseto o Mock
            sinon.restore();
    })
});