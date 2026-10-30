
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';

import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CreateSolicitudReservaDto } from './dto/create-solicitud-reserva.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly reservasService: ReservasService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.reservasService.findAll();
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }
   
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateReservaDto) {
  return this.reservasService.create(dto, true);
}
  
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservaDto,
  ) {
    return this.reservasService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.remove(id);
  }

  // Registrar solicitudes desde la página pública
  @Post('solicitudes')
  crearSolicitud(
  @Body() dto: CreateSolicitudReservaDto,) {
  return this.reservasService.create({
    ...dto,
    status: 'pendiente',});
  }
}

