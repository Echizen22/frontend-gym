import { Component } from '@angular/core';
import { ClasesService } from '../../../services/clases.service';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'shared-clases-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './clases-list.component.html',
  styleUrl: './clases-list.component.scss'
})
export class ClasesListComponent {
  clasesAgrupadas: {
    claseNombre: string,
    descripcion: string,
    duracion: number,
    instructor: {
      nombre: string;
      apellidos: string;
      especialidad: string;
    },
    horarios: { fecha: string, horaIni: string, horaFin: string }[]
  }[] = [
    {
      "claseNombre": "Zumba",
      "descripcion": "Energetic dance workout combining Latin and international music. All levels welcome.",
      "duracion": 60,
      "instructor": {
        "nombre": "Alice",
        "apellidos": "Smith",
        "especialidad": "Hatha Yoga"
      },
      "horarios": [
        { "fecha": "2025-05-06", "horaIni": "18:00", "horaFin": "19:00" },
        { "fecha": "2025-05-08", "horaIni": "19:30", "horaFin": "20:30" }
      ]
    },
    {
      "claseNombre": "Yoga",
      "descripcion": "Relaxing class focussing on breath control, meditation, and postures.",
      "duracion": 45,
      "instructor": {
        "nombre": "David",
        "apellidos": "Johnson",
        "especialidad": "Hatha Yoga"
      },
      "horarios": [
        { "fecha": "2025-05-07", "horaIni": "09:00", "horaFin": "09:45" },
        { "fecha": "2025-05-09", "horaIni": "08:30", "horaFin": "09:15" }
      ]
    },
    {
      "claseNombre": "Body Pump",
      "descripcion": "High-intensity workout using barbells and weights for a total body exercise.",
      "duracion": 55,
      "instructor": {
        "nombre": "Emma",
        "apellidos": "Davis",
        "especialidad": "Strength Training"
      },
      "horarios": [
        { "fecha": "2025-05-06", "horaIni": "17:00", "horaFin": "17:55" },
        { "fecha": "2025-05-08", "horaIni": "18:15", "horaFin": "19:10" }
      ]
    },
    {
      "claseNombre": "Pilates",
      "descripcion": "Controlled movements focused on core stability, flexibility, and posture.",
      "duracion": 50,
      "instructor": {
        "nombre": "Michael",
        "apellidos": "Brown",
        "especialidad": "Core Stability"
      },
      "horarios": [
        { "fecha": "2025-05-07", "horaIni": "10:00", "horaFin": "10:50" },
        { "fecha": "2025-05-09", "horaIni": "11:00", "horaFin": "11:50" }
      ]
    }
  ];

  constructor(
    private readonly clasesService: ClasesService
  ) {}

  ngOnInit(): void {
    // this.clasesService.getClasesConHorarios().subscribe(clases => {
    //   const agrupadas: any = {};

    //   clases.forEach(clase => {
    //     const clave = clase.claseId;
    //     if (!agrupadas[clave]) {
    //       agrupadas[clave] = {
    //         claseNombre: clase.claseNombre,
    //         descripcion: clase.descripcion,
    //         duracion: clase.duracion,
    //         instructor: `${clase.instructorNombre} ${clase.instructorApellidos}`,
    //         especialidad: clase.especialidad,
    //         horarios: []
    //       };
    //     }

    //     agrupadas[clave].horarios.push({
    //       fecha: clase.fecha,
    //       horaIni: clase.horaIni,
    //       horaFin: clase.horaFin
    //     });
    //   });

    //   this.clasesAgrupadas = Object.values(agrupadas);
    // });
  }

}
