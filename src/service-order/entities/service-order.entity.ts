import { IsNotEmpty } from 'class-validator';
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

@Exclude()
@Entity({ name: 'tb_service_order' })
export class ServiceOrder {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ name: 'problem_description', length: 255, nullable: false })
  problemDescription: string;

  @Expose()
  @Column({ type: 'date' })
  deadline: Date;

  @Expose()
  @Column({ length: 20, default: 'confirmed' })
  status: 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished';

  @Expose()
  @CreateDateColumn({ type: 'date', name: 'entry_date' })
  entryDate: Date;

  @Expose()
  @Column({ name: 'tech_notes', length: 1000, default: '' })
  techNotes: string;

  @Expose()
  @Column({ name: 'closure_date', nullable: true })
  closureDate: Date;

  @Expose()
  @Column({ name: 'closure_notes', length: 1000, nullable: true })
  closureNotes: string;

  @Expose()
  @ManyToOne(() => Technician, (technician) => technician.serviceOrders, {
    onDelete: 'CASCADE',
  })
  technician: Technician;

  @Expose()
  @ManyToOne(() => Costumer, (costumer) => costumer.serviceOrders, {
    onDelete: 'CASCADE',
  })
  costumer: Costumer;

  /*
        Campos relacionais:

        costumer: Costumer;

        device: Device;

        initialDiagnosis: InitialDiagnosis;

        services: Service[]
    */
}
