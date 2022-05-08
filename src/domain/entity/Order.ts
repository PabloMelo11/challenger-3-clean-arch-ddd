import Coupon from './Coupon';
import Cpf from './Cpf';
import Freight from './Freight';
import Item from './Item';
import OrderItem from './OrderItem';

export default class Order {
  cpf: Cpf;
  date: Date;
  private orderItems: OrderItem[];
  coupon?: Coupon;
  freight = new Freight();
  code?: string;
  private readonly SEQUENCIAL_ORDER = '00000000';

  constructor(cpf: string, date?: Date) {
    this.cpf = new Cpf(cpf);
    this.orderItems = [];
    this.date = date ? new Date(date) : new Date();
  }

  addItem(item: Item, quantity: number) {
    this.freight.addItem(item, quantity);
    this.orderItems.push(new OrderItem(item.idItem, item.price, quantity));
  }

  addCoupon(coupon: Coupon) {
    if (!coupon.isExpired(this.date)) {
      this.coupon = coupon;
    }
  }

  getFreight() {
    return this.freight.getTotal();
  }

  getTotal() {
    let total = this.orderItems.reduce((total, orderItem) => {
      total += orderItem.getTotal();
      return total;
    }, 0);
    if (this.coupon) total -= this.coupon.calculateDiscount(total);
    total += this.freight.getTotal();
    return total;
  }

  getCode(quantityOrders: number) {
    const year = this.date.getFullYear();
    const newSequencial = `${quantityOrders + 1}`.padStart(
      this.SEQUENCIAL_ORDER.length,
      '0'
    );
    this.code = `${year}${newSequencial}`;
    return this.code;
  }
}
