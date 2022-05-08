import Dimension from '../../src/domain/entity/Dimension';
import Item from '../../src/domain/entity/Item';
import ItemRepositoryMemory from '../../src/infra/repository/memory/ItemRepositoryMemory';
import OrderRepositoryMemory from '../../src/infra/repository/memory/OrderRepositoryMemory';
import CouponRepositoryMemory from '../../src/infra/repository/memory/CouponRepositoryMemory';
import PlaceOrder from '../../src/application/PlaceOrder';
import Coupon from '../../src/domain/entity/Coupon';

test('Deve fazer um pedido', async function () {
  const itemRepository = new ItemRepositoryMemory();
  const couponRepositoryMemory = new CouponRepositoryMemory();
  itemRepository.save(
    new Item(1, 'Guitarra', 1000, new Dimension(100, 30, 10), 3)
  );
  itemRepository.save(
    new Item(2, 'Amplificador', 5000, new Dimension(50, 50, 50), 20)
  );
  itemRepository.save(new Item(3, 'Cabo', 30, new Dimension(10, 10, 10), 1));
  const orderRepository = new OrderRepositoryMemory();
  const placeOrder = new PlaceOrder(
    itemRepository,
    orderRepository,
    couponRepositoryMemory
  );
  const input = {
    cpf: '935.411.347-80',
    orderItems: [
      { idItem: 1, quantity: 1 },
      { idItem: 2, quantity: 1 },
      { idItem: 3, quantity: 3 },
    ],
  };
  const output = await placeOrder.execute(input);
  expect(output.total).toBe(6350);
  expect(output.code).toBe('202200000001');
});

test('Deve fazer um pedido com cupom de desconto', async function () {
  const itemRepository = new ItemRepositoryMemory();
  const couponRepositoryMemory = new CouponRepositoryMemory();
  couponRepositoryMemory.save(
    new Coupon('VALE20', 20, new Date('2022-12-12T10:00:00'))
  );
  itemRepository.save(new Item(1, 'Guitarra', 1000));
  itemRepository.save(new Item(2, 'Amplificador', 5000));
  itemRepository.save(new Item(3, 'Cabo', 30));
  const orderRepository = new OrderRepositoryMemory();
  const placeOrder = new PlaceOrder(
    itemRepository,
    orderRepository,
    couponRepositoryMemory
  );
  const input = {
    cpf: '935.411.347-80',
    orderItems: [
      { idItem: 1, quantity: 1 },
      { idItem: 2, quantity: 1 },
      { idItem: 3, quantity: 3 },
    ],
    coupon: 'VALE20',
  };
  const output = await placeOrder.execute(input);
  expect(output.total).toBe(4872);
  expect(output.code).toBe('202200000001');
});

test('Nao Deve fazer um pedido com cupom de desconto expirado', async function () {
  const itemRepository = new ItemRepositoryMemory();
  const couponRepositoryMemory = new CouponRepositoryMemory();
  couponRepositoryMemory.save(
    new Coupon('VALE20', 20, new Date('2021-12-12T10:00:00'))
  );
  itemRepository.save(new Item(1, 'Guitarra', 1000));
  itemRepository.save(new Item(2, 'Amplificador', 5000));
  itemRepository.save(new Item(3, 'Cabo', 30));
  const orderRepository = new OrderRepositoryMemory();
  const placeOrder = new PlaceOrder(
    itemRepository,
    orderRepository,
    couponRepositoryMemory
  );
  const input = {
    cpf: '935.411.347-80',
    orderItems: [
      { idItem: 1, quantity: 1 },
      { idItem: 2, quantity: 1 },
      { idItem: 3, quantity: 3 },
    ],
    coupon: 'VALE20',
    today: new Date('2022-12-12T10:00:00'),
  };
  const output = await placeOrder.execute(input);
  expect(output.total).toBe(6090);
  expect(output.code).toBe('202200000001');
});
