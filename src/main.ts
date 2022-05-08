import ExpressAdapter from './infra/http/ExpressAdapter';
import GetItems from './application/GetItems';
import ItemRepositoryDatabase from './infra/repository/database/ItemRepositoryDatabase';
import OrderRepositoryDatabase from './infra/repository/database/OrderRepositoryDatabase';
import CouponRepositoryDatabase from './infra/repository/database/CouponRepositoryDatabase';
import PgPromiseConnectionAdapter from './infra/database/PgPromiseConnectionAdapter';
import PlaceOrder from './application/PlaceOrder';

const http = new ExpressAdapter();

const connection = new PgPromiseConnectionAdapter();
const itemRepository = new ItemRepositoryDatabase(connection);
const orderRepository = new OrderRepositoryDatabase(connection);
const couponRepository = new CouponRepositoryDatabase(connection);

http.on('get', '/items', async function (params: any, body: any) {
  const getItems = new GetItems(itemRepository);
  const output = await getItems.execute();
  return output;
});

http.on('post', '/orders', async function (params: any, body: any) {
  const placeOrder = new PlaceOrder(
    itemRepository,
    orderRepository,
    couponRepository
  );
  const output = await placeOrder.execute(body);
  return output;
});

http.listen(3000, () => console.log('server is running'));
