export interface ClaseConHorario {
  claseId: string;
  claseNombre: string;
  descripcion: string;
  duracion: number;
  capacidadMax: number;
  instructorNombre: string;
  instructorApellidos: string;
  especialidad: string;
  fecha: string; // ISO string
  horaIni: string;
  horaFin: string;
}
