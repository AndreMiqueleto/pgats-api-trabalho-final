import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 10, 
  //duration: '20s',
  iteration: 1,
  thresholds: {
    http_req_duration: ['p(90)<=2', 'p(95)<=3'],
    http_req_failed: ['rate<0.01']
  }
};

export default function() {
    let responseUserLogin = '';
    let token = '';

    group('Fazendo login', () =>  {
        
        responseUserLogin = http.post(
            'http://localhost:3000/users/login', 
            JSON.stringify({
                username: "joao",
                password: "123456"
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
        });
        token = responseUserLogin.json('token')
    })

    group('Realizando uma venda com sucesso', () =>  {

        let responseSale = http.post(
        'http://localhost:3000/sales', 
        JSON.stringify({
            productName: 'Fundamentos de API',
            quantity: 1,
            coupon: 'DIADOPROGRAMADOR'
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    // console.log(responseLesson)

         // Parseando o JSON da resposta
    const saleData = JSON.parse(responseSale.body);

        check(responseSale, {
            'status deve ser igual a 200': (r) => r.status === 200
        });

        check(saleData, {
            'O preço da venda deve ser R$127,50': (d) => d.price === 127.50
        });
    })
   

    group('Simulando o pensamento do usuario', () =>  {
        sleep(1); // User Think Time
    })
}
