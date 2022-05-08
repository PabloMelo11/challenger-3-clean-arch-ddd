import ValidateCoupon from '../../src/application/ValidateCoupon';
import Coupon from '../../src/domain/entity/Coupon';
import CouponRepositoryMemory from '../../src/infra/repository/memory/CouponRepositoryMemory';

test('Deve validar se o coupon nao esta expirado', async function () {
  const couponRepository = new CouponRepositoryMemory();
  const coupon = new Coupon('VALE20', 20, new Date('2023-12-12T10:00:00'));
  couponRepository.save(coupon);
  const validateCoupon = new ValidateCoupon(couponRepository);
  const input = { code: 'VALE20' };
  const output = await validateCoupon.execute(input);
  expect(output.code).toEqual('VALE20');
});

test('Deve validar se o coupon esta expirado', async function () {
  const couponRepository = new CouponRepositoryMemory();
  const coupon = new Coupon('VALE20', 20, new Date('2021-12-12T10:00:00'));
  couponRepository.save(coupon);
  const validateCoupon = new ValidateCoupon(couponRepository);
  const input = { code: 'VALE20', today: new Date('2022-01-01T10:00:00') };
  try {
    const coupon = await validateCoupon.execute(input);
    expect(coupon.code).toEqual('VALE20');
  } catch (err: any) {
    expect(err.message).toEqual('Coupon expired');
  }
});
