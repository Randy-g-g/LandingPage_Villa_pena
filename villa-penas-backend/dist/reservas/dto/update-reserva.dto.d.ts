export declare class UpdateReservaDto {
    name?: string;
    date?: string;
    time?: string;
    client?: string;
    guests?: number;
    package?: string;
    status?: 'confirmada' | 'pendiente' | 'bloqueada';
}
