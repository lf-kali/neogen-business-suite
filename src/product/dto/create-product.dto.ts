import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    desc?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    sku: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(44)
    barCode?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
    costPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
    salePrice: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    currentStock?: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    categoryId?: number;
}