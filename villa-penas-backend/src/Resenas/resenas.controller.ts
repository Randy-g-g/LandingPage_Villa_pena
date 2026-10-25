
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
import type { Resena } from './models/resena.model.ts';
import type { Express } from 'express';

@Controller('resenas')
export class ResenasController {
  constructor(
    private readonly resenasService: ResenasService,
  ) {}

  @Get()
  obtenerPublicadas(): Resena[] {
    return this.resenasService.obtenerPublicadas();
  }

  @Get('pendientes')
  obtenerPendientes(): Resena[] {
    return this.resenasService.obtenerPendientes();
  }
  
  @Get(':id')
obtenerPorId(
  @Param('id', ParseIntPipe) id: number,
): Resena {
  return this.resenasService.obtenerPorId(id);
}

  @Post()
  crear(@Body() dto: CreateResenaDto): Resena {
    return this.resenasService.crear(dto);
  }

  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResenaDto,
  ): Resena {
    return this.resenasService.actualizarEstado(id, dto);
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ): { mensaje: string } {
    return this.resenasService.eliminar(id);
  }
}