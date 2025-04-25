export interface Clase {
  nombre:       string;
  descripcion:  string;
  duracion:     number;
  capacidadMax: number;
  instructor:   Instructor;
  id:           string;
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
