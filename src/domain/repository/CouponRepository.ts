import Coupon from '../entity/Coupon';

export default interface CouponRepository {
  getByCode(code: string): Promise<Coupon | undefined>;
  list(): Promise<Coupon[]>;
  save(coupon: Coupon): Promise<void>;
}
