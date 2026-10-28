import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

// Información de los adicionales seleccionados
export class AdicionalReservaDto {

  @IsString()
  categoria!: string;

  @IsString()
  paquete!: string;

  @IsString()
  cantidad!: string;

  @IsString()
  detalle!: string;

  @IsNumber()
  @Min(0)
  precio!: number;
}

export class CreateReservaDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @IsString()
  @IsNotEmpty()
  client!: string;

  @IsInt()
  @Min(1)
  guests!: number;

  @IsString()
  @IsNotEmpty()
  package!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packagePrice?: number;

  @IsIn(['pendiente', 'confirmada', 'bloqueada'])
  status!: 'pendiente' | 'confirmada' | 'bloqueada';

  // Datos de contacto del cliente
  @IsOptional()
  @IsString()
  @Matches(/^(?:\+506)?[2-8]\d{7}$/, {
  message: 'El teléfono debe tener 8 dígitos de Costa Rica, con +506 opcional.',})
  phone?: string;

  @IsOptional()
  @IsEmail({}, {
  message: 'Ingresá un correo electrónico válido, por ejemplo: cliente@gmail.com.',})
  email?: string;

  @IsOptional()
  @IsString()
  message?: string;

  // Servicios adicionales
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdicionalReservaDto)
  adicionales?: AdicionalReservaDto[];
}
