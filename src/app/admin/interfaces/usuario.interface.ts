import { Membresia } from "./membresia.interface";
import { Promocion } from "./promocion.interface";

export interface Usuario {
  dni:                string;
  nombre:             string;
  apellidos:          string;
  email:              string;
  password?:          string;
  isAdmin?:            boolean;
  fechaRegistro?:      Date;
  fechaActualizacion?: Date;
  estado?:             string;
  telefono?:           string;
  usuarioMembresia?:  UsuarioMembresia;
}


export interface UsuarioMembresia {
  id: string;
  estado: string;
  fechaIni?: Date;
  fechaFin?: Date;
  idUsuario?: string;
  idMembresia?: string;
  idPromocion?: string;
  membresia?: Membresia;
  promocion?: Promocion;
}
