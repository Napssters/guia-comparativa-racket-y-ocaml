import { Component } from '@angular/core';
import { ModulosComponent } from '../modulos/modulos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [ModulosComponent, RouterModule],
  standalone: true
})
export class MainPageComponent {
  // Cascarón del componente principal
}
