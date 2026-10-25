export type EstadoResena =
  | 'PENDIENTE'
  | 'APROBADA'
  | 'RECHAZADA';

export interface Resena {
  id: number;
  usuario: string;
  comentario: string;
  calificacion: number;
  estado: EstadoResena;
  fechaCreacion: string;
}