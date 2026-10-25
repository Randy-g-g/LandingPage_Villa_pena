import { GaleriaService } from './galeria.service';
import { CreateFotoDto } from './dto/create-foto.dto';
import { UpdateFotoDto } from './dto/update-foto.dto';
import type { Foto } from './models/foto.model';
export declare class GaleriaController {
    private readonly galeriaService;
    constructor(galeriaService: GaleriaService);
    obtenerTodas(): Promise<Foto[]>;
    obtenerUna(id: string): Promise<Foto>;
    subirFoto(archivo: Express.Multer.File, datos: CreateFotoDto): Promise<Foto>;
    actualizarFoto(id: string, datos: UpdateFotoDto): Promise<Foto>;
    eliminarFoto(id: string): Promise<void>;
}
