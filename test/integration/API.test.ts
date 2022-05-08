import axios from 'axios';

test.skip('Deve chamar /items', async function () {
  const response = await axios({
    url: 'http://localhost:3000/items',
    method: 'get',
  });
  const items = response.data;
  expect(items).toHaveLength(3);
});

test.skip('Deve fazer um pedido', async function () {
  const response = await axios.post('http://localhost:3000/orders', {
    cpf: '935.411.347-80',
    coupon: 'VALE20',
    orderItems: [
      { idItem: 1, quantity: 1 },
      { idItem: 2, quantity: 1 },
      { idItem: 3, quantity: 3 },
    ],
    today: new Date('2022-05-08T17:51:00'),
  });
  expect(response.data.code).toBeTruthy();
  expect(response.data.total).toBeTruthy();
});
