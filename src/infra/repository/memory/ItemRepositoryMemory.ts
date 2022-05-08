import Item from '../../../domain/entity/Item';
import ItemRepository from '../../../domain/repository/ItemRepository';

export default class ItemRepositoryMemory implements ItemRepository {
  items: Item[];

  constructor() {
    this.items = [];
  }

  async get(idItem: number): Promise<Item | undefined> {
    const item = this.items.find((item) => item.idItem === idItem);
    return item;
  }

  async save(item: Item): Promise<void> {
    this.items.push(item);
  }

  async list(): Promise<Item[]> {
    return this.items;
  }
}
