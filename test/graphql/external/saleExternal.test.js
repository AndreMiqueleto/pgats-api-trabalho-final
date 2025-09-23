// Bibliotecas
const request = require('supertest');
const { expect,use } = require('chai');

const chaiExclude = require('chai-exclude');
const { test } = require('mocha/lib/mocha');
use(chaiExclude)

require('dotenv').config();

// Testes
describe('Sale', () => {
    describe('Mutation Register - GraphQL', () => {

         const createRegister = require('../fixture/requisicoes/cadastro/registrarProdutos.json')

         it("Testando o cadastro com sucesso de um produto - Status Code 200", async () => {
            const respostaCadastro = await request(process.env.BASE_URL_GRAPHQL)
                .post("")
                .send(createRegister);

            expect(respostaCadastro.status).to.equal(200);
            expect(respostaCadastro.body.data.registerProduct).to.equal('Product registered');
        });

        
        const testesDeErrosCadastroProdutos = require('../fixture/requisicoes/cadastro/registrarProdutosFaltandoCampos.json');
        testesDeErrosCadastroProdutos.forEach(testeErroCadastro => {
            it(`Testando a regra relacionada a ${testeErroCadastro.nomeDoTeste} `, async () => {
                const respostaCadastroErro = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .send(testeErroCadastro.registerProduct);

                expect(respostaCadastroErro.body.errors[0]).to.have.property('message', testeErroCadastro.mensagemEsperada);
            });
        })

    });

    describe('Mutation - Sales - GraphQL', () => {
        beforeEach(async () => {
            const loginUser= require('../fixture/requisicoes/login/loginUser.json');

            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(loginUser);
            token = respostaLogin.body.data.login
        });

        const vendaProduto = require('../fixture/requisicoes/vendas/vendaProduto.json');
        it("Testando uma venda com sucesso", async () => {
            const respostaVenda = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(vendaProduto);

            expect(respostaVenda.body.data.sell).to.have.property('price', 127.5);
            expect(respostaVenda.body.data.sell).to.have.property('message', "Sale completed with coupon DIADOPROGRAMADOR applied!");
            
        });

        const testesDeErrosVendaProdutos = require('../fixture/requisicoes/vendas/vendaErroProduto.json');
        testesDeErrosVendaProdutos.forEach(testeVenda => {
            it(`Testando a regra relacionada a ${testeVenda.nomeDoTeste}`, async () => {
                const respostaErroVenda = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(testeVenda.erroVendas);
                expect(respostaErroVenda.body.errors[0]).to.have.property('message', testeVenda.mensagemEsperada);
            });
        })

    });
});