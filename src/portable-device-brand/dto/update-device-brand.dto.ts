import { PartialType } from '@nestjs/swagger';
import { CreateDeviceBrandDTO } from './create-device-brand.dto';

export class UpdateDeviceBrandDTO extends PartialType(CreateDeviceBrandDTO) {}
