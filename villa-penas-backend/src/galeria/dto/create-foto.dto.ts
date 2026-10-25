import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateFotoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  descripcion!: string;
}