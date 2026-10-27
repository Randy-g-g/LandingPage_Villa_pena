export declare class AdicionalReservaDto {
    categoria: string;
    paquete: string;
    cantidad: string;
    detalle: string;
    precio: number;
}
export declare class CreateReservaDto {
    name: string;
    date: string;
    time: string;
    client: string;
    guests: number;
    package: string;
    status: 'pendiente' | 'confirmada' | 'bloqueada';
    phone?: string;
    email?: string;
    message?: string;
    adicionales?: AdicionalReservaDto[];
}
