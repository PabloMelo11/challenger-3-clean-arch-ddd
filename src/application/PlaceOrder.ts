import Order from '../domain/entity/Order';
import ItemRepository from '../domain/repository/ItemRepository';
import OrderRepository from '../domain/repository/OrderRepository';
import CouponRepository from '../domain/repository/CouponRepository';

export default class PlaceOrder {
  constructor(
    readonly itemRepository: ItemRepository,
    readonly orderRepository: OrderRepository,
    readonly couponRepository: CouponRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = new Order(input.cpf, input.today);
    const quantityOrders = await this.orderRepository.list();
    const code = order.getCode(quantityOrders.length);
    for (const orderItem of input.orderItems) {
      const item = await this.itemRepository.get(orderItem.idItem);
      if (!item) throw new Error('Item not found');
      order.addItem(item, orderItem.quantity);
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.getByCode(input.coupon);
      if (!coupon) throw new Error('Coupon not found');
      order.addCoupon(coupon);
    }
    await this.orderRepository.save(order);
    const total = order.getTotal();
    return {
      total,
      code,
    };
  }
}

type Input = {
  cpf: string;
  orderItems: { idItem: number; quantity: number }[];
  coupon?: string;
  today?: Date;
};

type Output = {
  total: number;
  code: string;
};
