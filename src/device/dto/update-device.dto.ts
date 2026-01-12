import { PartialType } from "@nestjs/swagger";
import { CreateDeviceDTO } from "./create-device.dto";

export class UpdateDeviceDTO extends PartialType(CreateDeviceDTO) {}