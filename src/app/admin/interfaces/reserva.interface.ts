export interface Reserva {
  fecha:   Date;
  usuario: Usuario;
  clase:   Clase;
  id:      string;
  estado:  string;
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
