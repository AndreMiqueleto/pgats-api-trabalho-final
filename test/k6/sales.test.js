import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { login } from './helpers/login.js';
import faker from "k6/x/faker"

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
  stages: [
    { duration: '3s', target: 10 }, //Ramp up
    { duration: '15s', target: 10 }, // Average
    { duration: '2s', target: 100 }, // Spike
    { duration: '3s', target: 100 }, // Spike
    { duration: '5s', target: 10},  // Average
    { duration: '5s', target:  0}, // Ramp down
   ],
};

const checkoutTrend = new Trend('checkout_duration');

export default function() {
    let password, token, username;

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

        const start = Date.now();
        const responseSale = http.post(url, payload, params);


        const duration = Date.now() - start;
        checkoutTrend.add(duration);

         // Parseando o JSON da resposta
        const saleData = JSON.parse(responseSale.body);

        check(responseSale, {
            'Venda: status deve ser igual a 200': (r) => r.status === 200
        });

        check(saleData, {
            'Venda: O preço da venda deve ser R$127,50': (d) => d.price === 127.50
        });
    })
   

    group('Simulando o pensamento do usuario', () =>  {
        sleep(1); // User Think Time
    })
}
