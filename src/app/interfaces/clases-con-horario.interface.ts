export interface ClaseDetalleCompleto {
  id:           string;
  nombre:       string;
  descripcion:  string;
  duracion:     number;
  capacidadMax: number;
  instructor:   Instructor;
  horarios:     Horario[];
  reserva?:      Reserva[];
}

export interface Horario {
  id:      string;
  horaIni: string;
  horaFin: string;
  fecha:   Date;
}

export interface Instructor {
  id:           string;
  nombre:       string;
  apellidos:    string;
  especialidad: string;
  experiencia:  number;
  telefono:     string;
  foto:         string;
}

export interface Reserva {
  fecha:   Date;
  idUsuario?: string;
  idClase:   string;
  id:      string;
  estado:  string;
}
