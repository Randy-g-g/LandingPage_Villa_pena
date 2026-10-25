import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateResenaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comentario!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion!: number;
}