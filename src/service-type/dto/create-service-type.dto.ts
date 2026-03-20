import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateServiceTypeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    costPrice?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
    salePrice: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    comissionPercent?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    desc?: string;
}