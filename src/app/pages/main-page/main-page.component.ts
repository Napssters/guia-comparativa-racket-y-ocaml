import { Router } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, PLATFORM_ID } from '@angular/core';

import { Component } from '@angular/core';
import { ModulosComponent } from '../modulos/modulos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [ModulosComponent, RouterModule, NgIf, HttpClientModule],
  standalone: true
})
export class MainPageComponent {
  modulos: any[] = [];
  moduloActualIndex: number = 0;
  showMore = false;
  isDesktop = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 768;
    }
    // Cargar módulos para navegación
    this.http.get<any[]>('assets/json-base/modulos.json').subscribe(data => {
      this.modulos = data;
      // Si hay un módulo en la ruta, seleccionarlo
      const currentPath = window.location.pathname.replace(/^\//, '');
      const idx = this.modulos.findIndex(m => m.page === currentPath);
      this.moduloActualIndex = idx >= 0 ? idx : 0;
    });
  }

  cambiarModulo(direccion: number) {
    const nuevoIdx = this.moduloActualIndex + direccion;
    if (nuevoIdx >= 0 && nuevoIdx < this.modulos.length) {
      this.moduloActualIndex = nuevoIdx;
      const page = this.modulos[nuevoIdx].page;
      if (page) {
        this.router.navigate(['/' + page]);
      }
    }
  }
}
