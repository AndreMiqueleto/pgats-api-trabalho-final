// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../graphql/app');

// Mock
const saleService = require('../../../services/saleService');
const productService = require('../../../services/productService');


// Testes
describe('Sale', () => {
    describe('MUTATION - Registrar Produto', () => {

        const productServiceMock = sinon.stub(productService, 'registerProduct');
        const registrarProdutos = require('../fixture/requisicoes/cadastro/registrarProdutos.json')

         it("Usando Mock: Testando o cadastro com sucesso de um produto ", async () => {
 
            productServiceMock.resolves({
                message: "Product registered"
            });

            const respostaCadastro = await request(app)
                .post('/graphql')
                .send(registrarProdutos);

            expect(respostaCadastro.body.data.registerProduct).to.equal("Product registered");
        });

        
        const testesDeErrosCadastroProdutos = require('../fixture/requisicoes/cadastro/registrarProdutosFaltandoCampos.json');
        testesDeErrosCadastroProdutos.forEach(testeCadastro => {
            it(`Usando Mock: Testando a regra relacionada a ${testeCadastro.nomeDoTeste}`, async () => {
              
                productServiceMock.returns(testeCadastro.mensagemEsperada);
                const respostaErroCadastro = await request(app)
                    .post('/graphql')
                    .send(testeCadastro.registerProduct);

                expect(respostaErroCadastro.body.errors[0]).to.have.property('message', testeCadastro.mensagemEsperada);
            });
        })

    });

    describe('MUTATION - Sales', () => {
        beforeEach(async () => {
            const loginUser = require('../fixture/requisicoes/login/loginUser.json');

            const respostaLogin = await request(app)
                .post('/graphql')
                .send(loginUser);

            token = respostaLogin.body.data.login
        });

        const vendaProduto = require('../fixture/requisicoes/vendas/vendaProduto.json');

        it("Usando Mock: Testando uma venda com sucesso de um produto", async () => {
            
            // Mocar a função saleService do Service
            const saleServiceMock = sinon.stub(saleService, 'sell');
            saleServiceMock.resolves({
                price: 127.5, 
                message: "Sale completed with coupon DIADOPROGRAMADOR applied!"
            });

            const respostaVenda = await request(app)
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(vendaProduto);

            expect(respostaVenda.body.data.sell).to.have.property('price', 127.5);
            expect(respostaVenda.body.data.sell).to.have.property('message', "Sale completed with coupon DIADOPROGRAMADOR applied!");
        });

        const testesDeErrosVendaProdutos = require('../fixture/requisicoes/vendas/vendaErroProduto.json');
        testesDeErrosVendaProdutos.forEach(testeVenda => {
            it(`Usando Mock: Testando a regra relacionada a ${testeVenda.nomeDoTeste}`, async () => {
                
                // Mocar apenas a função saleService do Service
                const saleServiceMock = sinon.stub(saleService, 'sellProduct');
                saleServiceMock.resolves({
                    message: testeVenda.mensagemEsperada
                });

                const respostaErroVenda = await request(app)
                    .post('/graphql')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testeVenda.erroVendas);
                
                //console.log(respostaErroVenda.body.data.sell.message)
                expect(respostaErroVenda.body.data.sell.message).to.equal(testeVenda.mensagemEsperada);
            });
        })

        

    });
    afterEach(() => {
            // Reseto o Mock
            sinon.restore();
    })
});