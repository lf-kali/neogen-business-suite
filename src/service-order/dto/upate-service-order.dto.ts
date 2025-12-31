import { PartialType } from '@nestjs/swagger';
import { CreateServiceOrderDTO } from './create-service-order.dto';

export class UpdateServiceOrderDto extends PartialType(CreateServiceOrderDTO) {}
