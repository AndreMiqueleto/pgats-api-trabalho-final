import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { SharedArray } from 'k6/data';

const produtos = new SharedArray('produtos', function () {
  return JSON.parse(open('./data/produtos.test.data.json'));
})

export let options = {
    vus: 7,
    iterations: 70,
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requests devem ser < 2s
    },
}

export default function() {
    const produto = produtos[(__VU - 1) % produtos.length]; // Reaproveitamento de dados
    console.log(produto);

    const name = produto.name;
    const type = produto.type;
    const price = produto.price;

    const res = http.post(
        `${getBaseUrl()}/products/register`, 
        JSON.stringify({ name, type, price }), 
        { headers: { 'Content-Type': 'application/json' } }
    );

    check(res, { 'login status 201': (r) => r.status === 201 });

    sleep(1);
}