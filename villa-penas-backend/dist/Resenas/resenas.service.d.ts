import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena } from './models/resena.model';
export declare class ResenasService {
    private readonly carpetaDatos;
    private readonly rutaArchivo;
    constructor();
    private leerResenas;
    private guardarResenas;
    obtenerTodas(): Resena[];
    obtenerPublicadas(): Resena[];
    obtenerPendientes(): Resena[];
    obtenerRechazadas(): Resena[];
    obtenerPorId(id: number): Resena;
    crear(dto: CreateResenaDto): Resena;
    actualizarEstado(id: number, dto: UpdateResenaDto): Resena;
    eliminar(id: number): {
        mensaje: string;
    };
}
