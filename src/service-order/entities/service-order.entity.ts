import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "tb_service_order"})
export class ServiceOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({name: "problem_description", length: 255, nullable: false})
    problemDescription: string;

    @Column({type: "date"})
    deadline: Date;

    @CreateDateColumn({name: "entry_date"})
    entryDate: Date;
    
    @Column({name: "tech_notes", length: 1000, default: ''})
    techNotes: string;

    @Column({name: "closure_date", nullable: true})
    closureDate: Date;

    @Column({name: "closure_notes", length: 1000, nullable: true})
    closureNotes: string;

    /*
        Campos relacionais:

        
        assignedTech: Technician;

        costumer: Costumer;

        device: Device;

        initialDiagnosis: InitialDiagnosis;

        services: Service[]
    */
}