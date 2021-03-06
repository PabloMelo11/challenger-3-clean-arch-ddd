import Connection from '../../database/Connection';
import Item from '../../../domain/entity/Item';
import Dimension from '../../../domain/entity/Dimension';
import ItemRepository from '../../../domain/repository/ItemRepository';

export default class ItemRepositoryDatabase implements ItemRepository {
  constructor(readonly connection: Connection) {}

  async get(idItem: number): Promise<Item | undefined> {
    const [item] = await this.connection.query(
      `
      select *
      from items i
      where i.id = $1
    `,
      idItem
    );

    return item
      ? new Item(
          item.id,
          item.description,
          item.price,
          new Dimension(item.width, item.height, item.length),
          item.weight
        )
      : undefined;
  }

  save(item: Item): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async list(): Promise<Item[]> {
    const itemsData = await this.connection.query('select * from items', []);
    const items: Item[] = [];
    for (const itemData of itemsData) {
      items.push(
        new Item(
          itemData.id_item,
          itemData.description,
          parseFloat(itemData.price)
        )
      );
    }
    return items;
  }
}
