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
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { GaleriaService } from './galeria.service';

import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';

import type { Foto } from './models/foto.model';
import type { Express } from 'express';

import { AuthGuard } from '../auth/auth.guard';

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

  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  // PATCH /galeria/:id
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  actualizarFoto(
    @Param('id') id: string,
    @Body() datos: UpdateFotoDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<Foto> {
    if (datos.descripcion === undefined && !archivo) {
      throw new BadRequestException(
        'Debés proporcionar una descripción o una imagen.',
      );
    }

    // Validar tipo y tamaño cuando se reemplaza la imagen
    if (archivo) {
      const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (!tiposPermitidos.includes(archivo.mimetype)) {
        throw new BadRequestException(
          'Solo se permiten imágenes JPG, PNG o WebP.',
        );
      }

      if (archivo.size > 5 * 1024 * 1024) {
        throw new BadRequestException(
          'La imagen no puede superar los 5 MB.',
        );
      }
    }

    return this.galeriaService.actualizarFoto(
      id,
      datos.descripcion,
      archivo,
    );
  }
  @UseGuards(AuthGuard)
  // DELETE /galeria/:id
  @Delete(':id')
  eliminarFoto(
    @Param('id') id: string,
  ): Promise<{ mensaje: string }> {
    return this.galeriaService.eliminarFoto(id);
  }
}
