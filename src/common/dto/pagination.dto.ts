import { Type } from "class-transformer";
import { IsOptional, IsPositive, Max } from "class-validator";

export class PaginationDTO {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Max(100)
    limit: number;
}