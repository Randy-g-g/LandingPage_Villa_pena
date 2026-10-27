import { OmitType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';

export class CreateSolicitudReservaDto extends OmitType(
  CreateReservaDto,
  ['status'] as const,
) {}