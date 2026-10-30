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

import { AdicionalesService } from './adicionales.service';
import { CreateAdicionalDto } from './dto/create-adicional.dto';
import { UpdateAdicionalDto } from './dto/update-adicional.dto';
import { Adicional } from './models/adicional.model';

@Controller('adicionales')
export class AdicionalesController {
  constructor(
    private readonly adicionalesService: AdicionalesService
  ) {}

  @Get()
  obtenerTodos(): Promise<Adicional[]> {
  return this.adicionalesService.obtenerTodos();
}

  @Get(':id')
  obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.adicionalesService.obtenerUno(id);
  }

  @Post()
  crear(@Body() dto: CreateAdicionalDto) {
    return this.adicionalesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdicionalDto
  ) {
    return this.adicionalesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.adicionalesService.eliminar(id);
  }
}