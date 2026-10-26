
export interface DetallePaquete {
  nombre: string;
  descripcion: string;
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  servicios: string[];
  precio: number;
  detalles: DetallePaquete[];
  activo: boolean;
}