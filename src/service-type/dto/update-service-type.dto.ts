import { PartialType } from "@nestjs/swagger";
import { CreateServiceTypeDTO } from "./create-service-type.dto";

export class UpdateServiceTypeDTO extends PartialType(CreateServiceTypeDTO) {}