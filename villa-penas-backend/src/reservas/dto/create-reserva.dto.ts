
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateReservaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  time: string;

  @IsString()
  @IsNotEmpty()
  client: string;

  @IsInt()
  @Min(0)
  guests: number;

  @IsString()
  @IsNotEmpty()
  package: string;

  @IsIn(['confirmada', 'pendiente', 'bloqueada'])
  status: 'confirmada' | 'pendiente' | 'bloqueada';
}
