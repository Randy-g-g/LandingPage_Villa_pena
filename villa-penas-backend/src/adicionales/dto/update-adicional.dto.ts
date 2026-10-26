import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';

import { Type } from 'class-transformer';

class PaqueteAdicionalDto {
  @IsNumber()
  @Min(1)
  id: number;

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  cantidad: string;

  @IsString()
  @MinLength(1)
  detalle: string;

  @IsNumber()
  @Min(0)
  precio: number;
}

export class UpdateAdicionalDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  categoria?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaqueteAdicionalDto)
  paquetes?: PaqueteAdicionalDto[];
}