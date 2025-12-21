import { CreateTechnicianDto } from "./create-technician.dto";
import {PartialType} from '@nestjs/mapped-types'

export class UpdateTechnicianDto extends PartialType(CreateTechnicianDto){}