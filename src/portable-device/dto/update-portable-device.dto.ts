import { PartialType } from "@nestjs/swagger";
import { CreatePortableDeviceDTO } from "./create-portable-device.dto";

export class UpdatePortableDeviceDTO extends PartialType(CreatePortableDeviceDTO) {}