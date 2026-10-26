import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import type { Resena } from './models/resena.model.ts';
export declare class ResenasController {
    private readonly resenasService;
    constructor(resenasService: ResenasService);
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
