export interface Clase {
  nombre:       string;
  descripcion:  string;
  duracion:     number;
  capacidadMax: number;
  instructor:   Instructor;
  id:           string;
  instructorNombre?: string; // Para mostrar en la tabla
  idInstructor?: string; // Para el formulario
  horarios?: Horario;
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


export interface Horario {
  id: string;
  horaIni: string;
  horaFin: string;
  idClase?: string;
  fecha: Date;
}
