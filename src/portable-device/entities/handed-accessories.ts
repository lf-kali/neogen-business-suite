import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class HandedAccessories {
    @ApiProperty()
    @IsNotEmpty()
    public charger: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public cable: boolean;

    @ApiProperty()
    @IsNotEmpty()
    public case: boolean;

    @ApiProperty()
    @IsOptional()
    @IsEnum(['sd_card', 'flash_drive', 'external_hdd', 'external_ssd'])
    public storageDevice?: 'sd_card' | 'flash_drive' | 'external_hdd' | 'external_ssd';

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    public other?: string;
}