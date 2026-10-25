
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { GaleriaService } from './galeria.service';

import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';

import type { Foto } from './models/foto.model';
import type { Express } from 'express';

@Controller('galeria')
export class GaleriaController {
  constructor(
    private readonly galeriaService: GaleriaService,
  ) {}

  // GET /galeria
  @Get()
  obtenerTodas(): Promise<Foto[]> {
    return this.galeriaService.obtenerTodas();
  }

  // GET /galeria/:id
  @Get(':id')
  obtenerUna(
    @Param('id') id: string,
  ): Promise<Foto> {
    return this.galeriaService.obtenerUna(id);
  }

  // POST /galeria
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  subirFoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    archivo: Express.Multer.File,

    @Body() datos: CreateFotoDto,
  ): Promise<Foto> {
    return this.galeriaService.subirFoto(
      archivo,
      datos.descripcion.trim(),
    );
  }

  // PATCH /galeria/:id
  @Patch(':id')
  actualizarFoto(
    @Param('id') id: string,
    @Body() datos: UpdateFotoDto,
  ): Promise<Foto> {
    if (datos.descripcion === undefined) {
      return this.galeriaService.obtenerUna(id);
    }

    return this.galeriaService.actualizarFoto(
      id,
      datos.descripcion.trim(),
    );
  }

  // DELETE /galeria/:id
  @Delete(':id')
  eliminarFoto(
    @Param('id') id: string,
  ): Promise<void> {
    return this.galeriaService.eliminarFoto(id);
  }
}
