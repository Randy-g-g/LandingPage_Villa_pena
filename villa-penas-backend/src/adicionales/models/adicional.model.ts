export interface PaqueteAdicional {
  id: number;
  nombre: string;
  cantidad: string;
  detalle: string;
  precio: number;
}

export interface Adicional {
  id: number;
  categoria: string;
  descripcion: string;
  paquetes: PaqueteAdicional[];
}