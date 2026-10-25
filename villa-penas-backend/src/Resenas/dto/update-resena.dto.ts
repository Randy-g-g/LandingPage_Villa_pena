import { IsIn } from 'class-validator';

export class UpdateResenaDto {
  @IsIn(['APROBADA', 'RECHAZADA'])
  estado!: 'APROBADA' | 'RECHAZADA';
}