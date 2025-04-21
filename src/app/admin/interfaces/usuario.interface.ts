export interface Usuario {
  dni:                string;
  nombre:             string;
  apellidos:          string;
  email:              string;
  isAdmin:            boolean;
  fechaRegistro:      Date;
  fechaActualizacion: Date;
  estado:             string;
  telefono:           null;
}
