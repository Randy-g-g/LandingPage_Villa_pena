export type EstadoReserva = 'confirmada' | 'pendiente' | 'bloqueada';

export class Reserva {
  id: number;
  name: string;
  date: string;
  time: string;
  client: string;
  guests: number;
  package: string;
  status: EstadoReserva;
}