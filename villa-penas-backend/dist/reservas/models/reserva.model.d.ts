export type EstadoReserva = 'pendiente' | 'confirmada' | 'bloqueada';
export interface AdicionalReserva {
    categoria: string;
    paquete: string;
    cantidad: string;
    detalle: string;
    precio: number;
}
export declare class Reserva {
    id: number;
    name: string;
    date: string;
    time: string;
    endTime: string;
    endDate: string;
    client: string;
    guests: number;
    package: string;
    status: EstadoReserva;
    phone?: string;
    email?: string;
    message?: string;
    adicionales?: AdicionalReserva[];
}
