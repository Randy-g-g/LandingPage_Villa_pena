declare class DetallePaqueteDto {
    nombre: string;
    descripcion: string;
}
export declare class UpdatePaqueteDto {
    nombre?: string;
    descripcion?: string;
    servicios?: string[];
    precio?: number;
    detalles?: DetallePaqueteDto[];
    activo?: boolean;
}
export {};
