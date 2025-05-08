import { Reserva } from "./reserva.interface";

export interface Horario {
  id: string;
  horaIni: string;
  horaFin: string;
  idClase?: string;
  fecha: Date;
  plazasOcupadas?: number;
}
