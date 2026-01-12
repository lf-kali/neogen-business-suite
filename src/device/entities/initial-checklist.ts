import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity({name: 'tb_initial_diagnosis'})
export class InitialDiagnosis {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'json', nullable: false})
    handedAccessories: {
        charger?: boolean,
        cable?: boolean,
        case?: boolean,
        storageDevice?: 'sd_card' | 'flash_drive' | 'external_hdd' | 'external_ssd' | string,
    }

    @Column({length: 255, nullable: false})
    externalState: string;

    @Column({default: true})
    turnsOn: boolean;
    
    @Column({default: 'ok', length: 255})
    audio: 'ok' | string;
    
    @Column({type: 'enum', enum: ['ok', 'cracked', 'leaking', 'no_video']})
    screen: 'ok' | 'cracked' | 'leaking' | 'no_video';
    
    @Column({type: 'enum', enum: ['ok', 'swollen', 'not_charging']})
    battery: 'ok' | 'swollen' | 'not_charging';

    @Column({type: 'enum', enum: ['ok', 'damaged', 'not_working']})
    rearCamera: 'ok' | 'damaged' | 'not_working';

    @Column({type: 'enum', enum: ['ok', 'damaged', 'not_working']})
    frontalCamera: 'ok' | 'damaged' | 'not_working';

    @Column({type: 'enum', enum: ['ok', 'pantom_touch', 'not_working']})
    touch: 'ok' | 'phantom_touch' | 'not_working';

    @OneToOne(() => Device, (device) => device.initialDiagnosis, {onDelete: 'CASCADE'})
    @JoinColumn()
    device: Device;
}