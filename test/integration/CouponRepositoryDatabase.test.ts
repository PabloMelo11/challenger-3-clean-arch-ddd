import Coupon from '../../src/domain/entity/Coupon';
import PgPromiseConnectionAdapter from '../../src/infra/database/PgPromiseConnectionAdapter';
import CouponRepositoryDatabase from '../../src/infra/repository/database/CouponRepositoryDatabase';

describe('Coupon repository suite', () => {
  let couponRepository: CouponRepositoryDatabase;

  beforeAll(async () => {
    const connection = new PgPromiseConnectionAdapter();
    couponRepository = new CouponRepositoryDatabase(connection);
  });

  test('Deve retornar cupons do banco de dados', async function () {
    const coupons = await couponRepository.list();
    expect(coupons[0].code).toEqual('VALE20');
  });

  test('Deve retornar um coupon pelo código', async function () {
    const coupon = await couponRepository.getByCode('VALE20');
    expect(coupon?.code).toEqual('VALE20');
  });

  test.skip('Deve salver um coupon de desconto', async function () {
    const coupon = new Coupon('VALE30', 30, new Date('2022-12-13T10:00:00'));
    await couponRepository.save(coupon);
    const couponVALE30 = await couponRepository.getByCode('VALE30');
    expect(couponVALE30?.code).toEqual('VALE30');
  });
});
