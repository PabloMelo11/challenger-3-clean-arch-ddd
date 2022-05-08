import Freight from '../domain/entity/Freight';
import ItemRepository from '../domain/repository/ItemRepository';

export default class SimulateFreight {
  constructor(readonly itemRepository: ItemRepository) {}

  async execute({ orderItems }: Input): Promise<Output> {
    const freight = new Freight();
    for (const orderItem of orderItems) {
      const item = await this.itemRepository.get(orderItem.idItem);
      if (!item) throw new Error('Item not found');
      freight.addItem(item, orderItem.quantity);
    }

    return { value: freight.getTotal() };
  }
}

type Input = {
  orderItems: { idItem: number; quantity: number }[];
};

type Output = { value: number };
