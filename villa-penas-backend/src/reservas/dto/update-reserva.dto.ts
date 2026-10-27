import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  guests?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  package?: string;

  @IsOptional()
  @IsIn(['confirmada', 'pendiente', 'bloqueada'])
  status?: 'confirmada' | 'pendiente' | 'bloqueada';
}
