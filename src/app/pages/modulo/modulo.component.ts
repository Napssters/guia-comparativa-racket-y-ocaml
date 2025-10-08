import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { DocumentacionComponent } from '../../shared/components/documentacion/documentacion.component';
import { ComparadorComponent } from '../../shared/components/comparador/comparador.component';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css'],
  imports: [
    RouterModule, CommonModule, NgClass,
    CodeEditorComponent, DocumentacionComponent,
    ComparadorComponent
  ],
  standalone: true
})
export class ModuloComponent implements OnInit {
  modulos: any[] = [];
  moduloActualIndex: number = 0;
  cambiarEjercicio(direccion: number) {
    const idx = this.ejerciciosKeys.indexOf(this.ejercicioSeleccionado);
    const nuevoIdx = idx + direccion;
    if (nuevoIdx >= 0 && nuevoIdx < this.ejerciciosKeys.length) {
      this.seleccionarEjercicio(this.ejerciciosKeys[nuevoIdx]);
    }
  }
  // Propiedades y métodos de la clase Angular
  moduloKey: string = '';
  ejercicios: { [key: string]: any } = {};
  ejerciciosKeys: string[] = [];
  ejerciciosDisplay: { key: string, numero: string, texto: string }[] = [];
  ejercicioSeleccionado: string = '';
  descripcionEjercicio: string = '';
  racketCode: string = '';
  ocamlCode: string = '';
  mostrarBotonOcaml: boolean = false;
  answer: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    // Cargar módulos para navegación
    this.http.get<any[]>('assets/json-base/modulos.json').subscribe(data => {
      this.modulos = data;
      // El índice se actualizará en ngOnInit
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.moduloKey = params.get('modulo') || '';
      // Sincroniza el índice del módulo actual según la ruta
      if (this.modulos && this.modulos.length > 0) {
        const idx = this.modulos.findIndex((m: any) => m.page === this.moduloKey);
        this.moduloActualIndex = idx >= 0 ? idx : 0;
      } else {
        // Si los módulos aún no han cargado, espera a que carguen
        this.http.get<any[]>('assets/json-base/modulos.json').subscribe(data => {
          this.modulos = data;
          const idx = this.modulos.findIndex((m: any) => m.page === this.moduloKey);
          this.moduloActualIndex = idx >= 0 ? idx : 0;
        });
      }
      this.cargarEjercicios();
    });
  }

  cargarEjercicios() {
    this.http.get<any>('assets/json-base/ejercicios.json').subscribe(data => {
      if (data[this.moduloKey]) {
        this.ejercicios = data[this.moduloKey];
        this.ejerciciosKeys = Object.keys(this.ejercicios).sort();
        // Genera la lista para mostrar con número y texto formateado
        this.ejerciciosDisplay = this.ejerciciosKeys.map(key => {
          const match = key.match(/ejercicio-(\d+)/);
          const numero = match ? match[1] : '';
          return {
            key,
            numero,
            texto: 'Ejemplo'
          };
        });
        this.ejercicioSeleccionado = this.ejerciciosKeys[0];
        this.actualizarEjercicio();
      }
    });
  }

  seleccionarEjercicio(key: string) {
    this.ejercicioSeleccionado = key;
    this.actualizarEjercicio();
  }

  actualizarEjercicio() {
    const ejercicio = this.ejercicios[this.ejercicioSeleccionado];
    this.descripcionEjercicio = ejercicio?.description || '';
    this.racketCode = ejercicio?.racket?.code || '';
    this.answer = ejercicio?.answer || '';
    this.ocamlCode = '';
    this.mostrarBotonOcaml = false;
  }

  mostrarConversion() {
    const ejercicio = this.ejercicios[this.ejercicioSeleccionado];
    this.ocamlCode = ejercicio?.ocaml?.code || '';
    this.mostrarBotonOcaml = true;
  }


}
