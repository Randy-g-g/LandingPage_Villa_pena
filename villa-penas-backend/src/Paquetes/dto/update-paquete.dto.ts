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
import { DetallePaquete } from '../models/paquete.model';

class DetallePaqueteDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  descripcion: string;
}

export class UpdatePaqueteDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicios?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetallePaqueteDto)
  detalles?: DetallePaquete[];
}