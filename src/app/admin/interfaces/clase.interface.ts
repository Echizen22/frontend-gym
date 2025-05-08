import { Horario } from "./horario.interface";
import { Instructor } from "./instructor.interface";

export interface Clase {
  id:           string;
  nombre:       string;
  descripcion:  string;
  duracion:     number;
  capacidadMax: number;

  instructor:   Instructor;
  instructorNombre?: string; // Para mostrar en la tabla
  idInstructor?: string; // Para el formulario
  horarios?: Horario;
}


// export interface Instructor {
//   id:           string;
//   nombre:       string;
//   apellidos:    string;
//   especialidad: string;
//   experiencia:  number;
//   telefono:     string;
//   foto:         string;
// }



