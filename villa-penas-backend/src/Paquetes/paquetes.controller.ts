import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';

import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { Paquete } from './models/paquete.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('paquetes')
export class PaquetesController {

  constructor(
    private readonly paquetesService: PaquetesService
  ) {}

 
  @Get()
  obtenerTodos(): Promise<Paquete[]> {
  return this.paquetesService.obtenerTodos();
}
  
  obtenerUno(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.paquetesService.obtenerUno(id);
  }
  @UseGuards(AuthGuard)
  @Post()
  crear(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.crear(dto);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaqueteDto
  ) {
    return this.paquetesService.actualizar(id, dto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.paquetesService.eliminar(id);
  }
}