import { Clase } from "./clase.interface";
import { Horario } from "./horario.interface";
import { Usuario } from "./usuario.interface";

export enum EstadoHorario {
  Pendiente =  'pendiente',
  Confirmada = 'confirmada',
  Cancelada =  'cancelada'
}



export interface Reserva {
  id?:     string;
  fecha:   Date;
  estado:  EstadoHorario;
  idHorario: string;
  idUsuario?: string;
  usuario?: Usuario;
  horario?: Horario;
}



export interface ReservaPorHorario {
  idUsuario: string;
  idHorario: string;
  fecha:      Date;
  estado:    EstadoHorario;
}


// export interface Horario {
//   id: string;
//   horaIni: string;
//   horaFin: string;
//   idClase?: string;
//   fecha: Date;
//   plazasOcupadas?: number;
//   reserva
// }



// export interface Clase {
//   id:           string;
//   nombre:       string;
//   descripcion:  string;
//   duracion:     number;
//   capacidadMax: number;
// }

// export interface Usuario {
//   dni:                string;
//   nombre:             string;
//   apellidos:          string;
//   email:              string;
//   isAdmin:            boolean;
//   fechaRegistro:      Date;
//   fechaActualizacion: Date;
//   estado:             string;
//   telefono?:           string;
// }
