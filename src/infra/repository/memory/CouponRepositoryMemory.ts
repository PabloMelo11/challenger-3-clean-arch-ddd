import Coupon from '../../../domain/entity/Coupon';
import CouponRepository from '../../../domain/repository/CouponRepository';

export default class CouponRepositoryMemory implements CouponRepository {
  coupons: Coupon[];

  constructor() {
    this.coupons = [];
  }

  async getByCode(code: string): Promise<Coupon | undefined> {
    const coupon = this.coupons.find((coupon) => coupon.code === code);
    return coupon;
  }

  async list(): Promise<Coupon[]> {
    return this.coupons;
  }

  async save(coupon: Coupon): Promise<void> {
    this.coupons.push(coupon);
  }
}
