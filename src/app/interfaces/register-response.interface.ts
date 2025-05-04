export interface RegisterResponse {
  dni:                string;
  nombre:             string;
  apellidos:          string;
  email:              string;
  fechaRegistro:      Date;
  telefono:           null;
  isAdmin:            boolean;
  fechaActualizacion: Date;
  estado:             string;
  token:              string;
}
