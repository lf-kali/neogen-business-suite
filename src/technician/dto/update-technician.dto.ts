import { CreateTechnicianDto } from './create-technician.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTechnicianDto extends PartialType(CreateTechnicianDto) {}
