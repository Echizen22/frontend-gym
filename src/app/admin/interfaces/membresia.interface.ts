import { Promocion } from "./promocion.interface";

export interface Membresia {
  id:          string;
  nombre:      string;
  descripcion: string;
  precio:      number;
  tipo:        string;
  duracion:    number;
  membresiaPromociones?: MembresiaPromocion;
}

export interface MembresiaPromocion {
  id: string;
  idMembresia?: string;
  idPromocion?: string;
  promocion?: Promocion;
}
