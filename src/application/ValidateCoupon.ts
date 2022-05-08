import CouponRepository from '../domain/repository/CouponRepository';

export default class ValidateCoupon {
  constructor(readonly couponRepository: CouponRepository) {}

  async execute({ code, today = new Date() }: Input): Promise<Output> {
    const coupon = await this.couponRepository.getByCode(code);
    if (!coupon) throw new Error('Coupon not found');
    const isCouponExpired = coupon.isExpired(today);
    if (isCouponExpired) throw new Error('Coupon expired');
    return { code: coupon.code };
  }
}

type Input = { code: string; today?: Date };

type Output = {
  code: string;
};
