import { Component } from '@angular/core';
import { ModulosComponent } from '../modulos/modulos.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [ModulosComponent],
  standalone: true
})
export class MainPageComponent {
  // Cascarón del componente principal
}
