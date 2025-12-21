import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';

@Entity({ name: 'tb_technician' })
export class Technician {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  name: string;

  @IsEmail()
  @Column({ length: 255, nullable: true })
  email: string;

  @MinLength(8)
  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ length: 14, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 5000, nullable: true })
  profilePicture: string;

  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.technician)
  serviceOrders: ServiceOrder[];
}
