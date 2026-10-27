export type EstadoReserva =
    | 'pendiente'
    | 'confirmada'
    | 'bloqueada';

export interface AdicionalReserva {
    categoria: string;
    paquete: string;
    cantidad: string;
    detalle: string;
    precio: number;
}

export class Reserva {
    id!: number;
    name!: string;
    date!: string;
    time!: string;
    endTime!: string;
    endDate!: string;
    client!: string;
    guests!: number;
    package!: string;
    status!: EstadoReserva;

    // Información del cliente y su solicitud
    phone?: string;
    email?: string;
    message?: string;
    adicionales?: AdicionalReserva[];
}
