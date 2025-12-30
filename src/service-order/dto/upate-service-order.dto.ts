import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOrderDTO } from './create-service-order.dto';

export class UpdateServiceOrderDto extends PartialType(CreateServiceOrderDTO) {}
