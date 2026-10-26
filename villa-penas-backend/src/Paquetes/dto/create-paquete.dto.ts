
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';

import { Type } from 'class-transformer';

class DetallePaqueteDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  descripcion: string;
}

export class CreatePaqueteDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  descripcion: string;

  @IsArray()
  @IsString({ each: true })
  servicios: string[];

  @IsNumber()
  @Min(0)
  precio: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetallePaqueteDto)
  detalles: DetallePaqueteDto[];

  @IsBoolean()
  activo: boolean;
}
