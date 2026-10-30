
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import type { Resena } from './models/resena.model';

@Controller('resenas')
export class ResenasController {
  constructor(
    private readonly resenasService: ResenasService,
  ) {}

  // Obtener reseñas publicadas
  @Get()
  obtenerPublicadas(): Promise<Resena[]> {
    return this.resenasService.obtenerPublicadas();
  }

  // Obtener reseñas pendientes
  @Get('pendientes')
  obtenerPendientes(): Promise<Resena[]> {
    return this.resenasService.obtenerPendientes();
  }

  // Obtener reseñas rechazadas
  @Get('rechazadas')
  obtenerRechazadas(): Promise<Resena[]> {
    return this.resenasService.obtenerRechazadas();
  }

  // Obtener reseña por ID
  @Get(':id')
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Resena> {
    return this.resenasService.obtenerPorId(id);
  }

  // Crear reseña
  @Post()
  crear(
    @Body() dto: CreateResenaDto,
  ): Promise<Resena> {
    return this.resenasService.crear(dto);
  }

  // Aprobar o rechazar reseña
  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResenaDto,
  ): Promise<Resena> {
    return this.resenasService.actualizarEstado(id, dto);
  }

  // Eliminar reseña definitivamente
  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ mensaje: string }> {
    return this.resenasService.eliminar(id);
  }
}
