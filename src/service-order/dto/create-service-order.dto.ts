import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceOrderDTO {
  @IsNotEmpty()
  problemDescription: string;

  @IsDateString()
  deadline: Date;

  @IsOptional()
  status?: 'confirmed' | 'acquiring_parts' | 'ongoing' | 'finished';

  @IsNotEmpty()
  technicianId: number;

  @IsNotEmpty()
  costumerId: number;
}
