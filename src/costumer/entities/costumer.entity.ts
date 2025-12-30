import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity('tb_costumers')
export class Costumer {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 255, nullable: false })
  name: string;

  @Expose()
  @Column({ length: 255, nullable: true })
  email: string;

  @Expose()
  @Column({ length: 20, nullable: false })
  phone: string;

  @Exclude()
  @Column({ length: 255, nullable: false })
  address: string;

  @Exclude()
  @Column({ length: 8, nullable: false })
  cep: string;

  @Exclude()
  @Column({ length: 11, nullable: false })
  cpf: string;

  @Exclude()
  @Column({ length: 14, nullable: false })
  cnpj: string;

  @Expose()
  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.costumer)
  serviceOrders: ServiceOrder[];
}
