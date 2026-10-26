import type { Foto } from './models/foto.model';
export declare class GaleriaService {
    private readonly carpeta;
    private readonly carpetaDatos;
    private readonly archivoDatos;
    private leerFotos;
    private guardarFotos;
    obtenerTodas(): Promise<Foto[]>;
    obtenerUna(id: string): Promise<Foto>;
    subirFoto(archivo: Express.Multer.File, descripcion: string): Promise<Foto>;
    actualizarFoto(id: string, descripcion: string): Promise<Foto>;
    eliminarFoto(id: string): Promise<void>;
}
