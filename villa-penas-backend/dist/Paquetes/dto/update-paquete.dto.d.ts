import { DetallePaquete } from '../models/paquete.model';
export declare class UpdatePaqueteDto {
    nombre?: string;
    descripcion?: string;
    servicios?: string[];
    precio?: number;
    detalles?: DetallePaquete[];
}
