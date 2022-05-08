import Connection from '../../database/Connection';
import OrderRepository from '../../../domain/repository/OrderRepository';
import Order from '../../../domain/entity/Order';

export default class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: Connection) {}

  async list(): Promise<Order[]> {
    const ordersData = await this.connection.query('select * from orders', []);
    const orders: Order[] = [];
    for (const orderData of ordersData) {
      orders.push(new Order(orderData.cpf, orderData.created_order));
    }
    return orders;
  }

  async save(order: Order): Promise<void> {
    await this.connection.query(
      'INSERT INTO orders (total, code, freight, coupon, created_order, created_at, cpf) VALUES(${total}, ${code}, ${freight}, ${coupon}, ${created_order}, ${created_at}, ${cpf});',
      {
        total: order.getTotal(),
        code: order.code,
        freight: order.getFreight(),
        coupon: order.coupon?.code,
        created_order: order.date,
        created_at: new Date(),
        cpf: order.cpf.value,
      }
    );
  }
}
