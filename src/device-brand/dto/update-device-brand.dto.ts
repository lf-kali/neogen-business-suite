import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';
import { CreateDeviceBrandDTO } from './create-device-brand.dto';

export class UpdateDeviceBrandDTO extends PartialType(CreateDeviceBrandDTO) {}
