import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductCategoryDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsInt({each: true})
    productIDs?: Array<number>;
}

export class UpdateProductCategoryDTO extends PartialType(CreateProductCategoryDTO) {}