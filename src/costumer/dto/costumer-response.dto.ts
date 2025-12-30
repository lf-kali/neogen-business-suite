import { Exclude, Expose } from 'class-transformer';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';

@Exclude()
export class CostumerResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  serviceOrders: ServiceOrder[];
}
