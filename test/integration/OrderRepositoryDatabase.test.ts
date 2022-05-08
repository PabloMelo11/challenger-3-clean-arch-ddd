import OrderRepositoryDatabase from '../../src/infra/repository/database/OrderRepositoryDatabase';
import PgPromiseConnectionAdapter from '../../src/infra/database/PgPromiseConnectionAdapter';
import Coupon from '../../src/domain/entity/Coupon';
import Item from '../../src/domain/entity/Item';
import Dimension from '../../src/domain/entity/Dimension';
import Order from '../../src/domain/entity/Order';

describe('Coupon repository suite', () => {
  let orderRepository: OrderRepositoryDatabase;

  beforeAll(async () => {
    const connection = new PgPromiseConnectionAdapter();
    orderRepository = new OrderRepositoryDatabase(connection);
  });

  test.skip('Deve criar uma order', async function () {
    const coupon = new Coupon('VALE30', 30, new Date('2022-12-13T10:00:00'));
    const item = new Item(1, 'Guitarra', 1000, new Dimension(100, 30, 10), 3);
    const order = new Order('935.411.347-80', new Date('2022-05-08T17:37:00'));
    order.addItem(item, 1);
    order.addCoupon(coupon);
    order.getCode(0);
    await orderRepository.save(order);
    const orders = await orderRepository.list();
    expect(orders).toHaveLength(1);
  });

  test.skip('Deve retornar orders do banco de dados', async function () {
    const orders = await orderRepository.list();
    expect(orders).toHaveLength(1);
  });
});
