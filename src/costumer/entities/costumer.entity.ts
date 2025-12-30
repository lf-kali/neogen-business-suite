import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceOrder } from '../../service-order/entities/service-order.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
@Entity('tb_costumers')
export class Costumer {

  @ApiProperty()
  @Expose()
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
  @Expose()
  @Column({ length: 20, nullable: false })
  phone: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 255, nullable: false })
  address: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 8, nullable: false })
  cep: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 11, nullable: false })
  cpf: string;

  @ApiProperty()
  @Exclude()
  @Column({ length: 14, nullable: false })
  cnpj: string;

  @ApiProperty()
  @Expose()
  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.costumer)
  serviceOrders: ServiceOrder[];
}
