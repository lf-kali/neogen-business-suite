import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class InitialDiagnosis {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    public externalState: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    public turnsOn: boolean;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    public audio: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(['ok', 'damaged', 'no_video'])
    public screen: 'ok' | 'damaged' | 'no_video';
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(['ok', 'damaged', 'swollen', 'not_charging'])
    public battery: 'ok' | 'damaged' |'swollen' | 'not_charging';
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(['ok', 'damaged', 'not_working'])
    public rearCamera: 'ok' | 'damaged' | 'not_working';
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(['ok', 'damaged', 'not_working'])
    public frontalCamera: 'ok' | 'damaged' | 'not_working';
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(['ok', 'damaged', 'phantom_touch', 'not_working'])
    public touch: 'ok' | 'damaged' | 'phantom_touch' | 'not_working';
}