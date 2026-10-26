declare class PaqueteAdicionalDto {
    id: number;
    nombre: string;
    cantidad: string;
    detalle: string;
    precio: number;
}
export declare class UpdateAdicionalDto {
    categoria?: string;
    descripcion?: string;
    paquetes?: PaqueteAdicionalDto[];
}
export {};
