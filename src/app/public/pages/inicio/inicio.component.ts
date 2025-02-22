import { Component } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';

interface Promocion {
  url: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    AccordionModule,
    CarouselModule,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  public miliSegunds: number = 6000;

  public promocion: Promocion[] = [
    { url: "https://media.revistagq.com/photos/65b12cd1df908a3c3a4d7373/16:9/w_2560%2Cc_limit/fitness%2520portada.jpg"},
    { url: "https://blog.trainingym.com/hs-fs/hubfs/AdobeStock_174212531%20(1).jpeg?width=999&height=667&name=AdobeStock_174212531%20(1).jpeg"},
    { url: "https://etenonfitness.com/wp-content/uploads/2019/10/Low-cost-1024x683.jpg"},
  ];

}
