import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class InitialDiagnosis {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    public externalState: string;
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    public turnsOn?: boolean;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    public audio?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(['ok', 'damaged', 'no_video'])
    public screen?: 'ok' | 'damaged' | 'no_video';
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(['ok', 'damaged', 'swollen', 'not_charging'])
    public battery?: 'ok' | 'damaged' |'swollen' | 'not_charging';
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(['ok', 'damaged', 'not_working'])
    public rearCamera?: 'ok' | 'damaged' | 'not_working';
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(['ok', 'damaged', 'not_working'])
    public frontalCamera?: 'ok' | 'damaged' | 'not_working';
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(['ok', 'damaged', 'phantom_touch', 'not_working'])
    public touch?: 'ok' | 'damaged' | 'phantom_touch' | 'not_working';
}