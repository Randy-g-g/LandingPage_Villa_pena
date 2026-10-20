import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe
} from '@nestjs/common';

import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Controller('paquetes')
export class PaquetesController {

  constructor(
    private readonly paquetesService: PaquetesService
  ) {}

  @Get()
  obtenerTodos() {
    return this.paquetesService.obtenerTodos();
  }

  @Get(':id')
  obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.paquetesService.obtenerUno(id);
  }

  @Post()
  crear(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaqueteDto
  ) {
    return this.paquetesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.paquetesService.eliminar(id);
  }
}