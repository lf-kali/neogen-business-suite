import { PartialType } from '@nestjs/mapped-types';
import { CreateCostumerDTO } from './create-costumer.dto';

export class UpdateCostumerDTO extends PartialType(CreateCostumerDTO) {}
