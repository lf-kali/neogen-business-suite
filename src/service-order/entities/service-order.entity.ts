import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Technician } from '../../technician/entities/technician.entity';
import { Costumer } from '../../costumer/entities/costumer.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
@Entity({ name: 'tb_service_order' })
export class ServiceOrder {

  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({ name: 'problem_description', length: 255, nullable: false })
  problemDescription: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'date' })
  deadline: Date;

  @ApiProperty()
  @Expose()
  @Column({ length: 20, default: 'confirmed' })
  status: 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished';

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ type: 'datetime', name: 'entry_date' })
  entryDate: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'tech_notes', length: 1000, default: '' })
  techNotes: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'closure_date', nullable: true })
  closureDate: Date;

  @ApiProperty()
  @Expose()
  @Column({ name: 'closure_notes', length: 1000, nullable: true })
  closureNotes: string;

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

  /*
        Campos relacionais:

        device: Device;

        initialDiagnosis: InitialDiagnosis;

        services: Service[];
    */
}
