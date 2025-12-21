import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'tb_technician' })
@Exclude()
export class Technician {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 255, nullable: false })
  name: string;

  @Expose()
  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ length: 14, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: false })
  address: string;

  @Expose()
  @Column({ length: 5000, nullable: true })
  profilePicture: string;

  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.technician)
  serviceOrders: ServiceOrder[];
}
