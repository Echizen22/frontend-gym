export interface Reserva {
  fecha:   Date;
  idUsuario?: string;
  idClase:   string;
  id:      string;
  estado:  string;
  usuario: Usuario;
  clase: Clase;
}

export interface Clase {
  id:           string;
  nombre:       string;
  descripcion:  string;
  duracion:     number;
  capacidadMax: number;
}

export interface Usuario {
  dni:                string;
  nombre:             string;
  apellidos:          string;
  email:              string;
  isAdmin:            boolean;
  fechaRegistro:      Date;
  fechaActualizacion: Date;
  estado:             string;
  telefono:           string;
}
