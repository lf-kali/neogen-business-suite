import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Technician } from '../../technician/entities/technician.entity';
import { Costumer } from '../../costumer/entities/costumer.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PortableDevice } from '../../portable-device/entities/portable-device.entity';
import { Product } from '../../product/entities/product.entity';
import { ServiceType } from '../../service-type/entities/service-type.entity';

@Exclude()
@Entity({ name: 'tb_service_order' })
export class ServiceOrder {

  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'date' })
  deadline: Date;

  @ApiProperty()
  @Expose()
  @Column({ length: 20, default: 'confirmed' })
  status: 'pending' | 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished' | 'cancelled';

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ type: 'datetime', name: 'entry_date' })
  entryDate: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'tech_notes', length: 1000, default: '' })
  techNotes?: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'closure_date', nullable: true })
  closureDate: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'closure_notes', length: 1000, nullable: true })
  closureNotes: string;

  @Expose()
  @Column({type: 'float', nullable: false})
  finalPrice: number;

  @ApiProperty()
  @Expose()
  @ManyToOne(() => Technician, (technician) => technician.serviceOrders, {
    onDelete: 'CASCADE',
  })
  technician: Technician;

  @ApiProperty()
  @Expose()
  @ManyToOne(() => Costumer, (costumer) => costumer.serviceOrders, {
    onDelete: 'CASCADE',
  })
  costumer: Costumer;

  @ApiProperty()
  @Expose()
  @OneToMany(() => PortableDevice, (device) => device.serviceOrder)
  devices: PortableDevice[];

  @Expose()
  @ManyToMany(()=> Product, (product)=>product.serviceOrders)
  @JoinTable()
  products: Product[];

  @Expose()
  @ManyToMany(() => ServiceType, (servicetype) => servicetype.serviceOrders)
  @JoinTable()
  services: ServiceType[];
}
