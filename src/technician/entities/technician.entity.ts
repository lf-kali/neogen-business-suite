import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_technician' })
@Exclude()
export class Technician {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty()
  @Expose()
  @Column({ length: 255, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ length: 255, nullable: false })
  password: string;

  @ApiProperty()
  @Column({ length: 14, nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ length: 255, nullable: false })
  address: string;

  @ApiProperty()
  @Expose()
  @Column({ length: 5000, nullable: true })
  profilePicture: string;

  @ApiProperty()
  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.technician)
  serviceOrders: ServiceOrder[];
}
