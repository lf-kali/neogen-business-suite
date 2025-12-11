import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Technician } from "../../technician/entities/technician.entity";

@Entity({name: "tb_service_order"})
export class ServiceOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({name: "problem_description", length: 255, nullable: false})
    problemDescription: string;

    @Column({type: "date"})
    deadline: Date;

    @IsNotEmpty()
    @Column({length:20, nullable: false})
    status: 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished';

    @CreateDateColumn({name: "entry_date"})
    entryDate: Date;
    
    @Column({name: "tech_notes", length: 1000, default: ''})
    techNotes: string;

    @Column({name: "closure_date", nullable: true})
    closureDate: Date;

    @Column({name: "closure_notes", length: 1000, nullable: true})
    closureNotes: string;

    @ManyToOne(() => Technician, (technician) => technician.serviceOrders, {onDelete: 'CASCADE'})
    technician: Technician;

    /*
        Campos relacionais:

        
        assignedTech: Technician;

        costumer: Costumer;

        device: Device;

        initialDiagnosis: InitialDiagnosis;

        services: Service[]
    */
}