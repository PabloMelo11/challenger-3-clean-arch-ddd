import Connection from '../../database/Connection';
import CouponRepository from '../../../domain/repository/CouponRepository';
import Coupon from '../../../domain/entity/Coupon';

export default class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly connection: Connection) {}

  async getByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await this.connection.query(
      `
      select *
      from coupons c
      where c.code = $1
    `,
      code
    );

    return coupon
      ? new Coupon(coupon.code, coupon.percentage, new Date(coupon.expire_date))
      : undefined;
  }

  async list(): Promise<Coupon[]> {
    const couponsData = (await this.connection.query(
      'select * from coupons',
      []
    )) as Coupon[];
    const coupons: Coupon[] = [];
    for (const itemData of couponsData) {
      coupons.push(
        new Coupon(
          itemData.code,
          itemData.percentage,
          new Date(itemData.expireDate)
        )
      );
    }
    return coupons;
  }

  async save(coupon: Coupon): Promise<void> {
    await this.connection.query(
      'INSERT INTO coupons (code, percentage, expire_date, created_at) VALUES(${code}, ${percentage}, ${expire_date}, ${created_at});',
      {
        code: coupon.code,
        percentage: coupon.percentage,
        expire_date: coupon.expireDate,
        created_at: new Date(),
      }
    );
  }
}
