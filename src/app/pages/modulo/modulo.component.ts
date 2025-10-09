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
  // Debugger/Comparador línea a línea
  comparacionData: any = null;
  debugReady: boolean = false;
  lineaActualIndex: number = 0;
  lineaActual: any = null;
  totalLineas: number = 0;
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
  mostrarComparador: boolean = false;
  answer: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    // Cargar módulos para navegación
    this.http.get<any[]>('assets/json-base/modulos.json').subscribe(data => {
      this.modulos = data;
      // El índice se actualizará en ngOnInit
    });
    // Cargar comparacion.json para el debugger
    this.http.get<any>('assets/json-base/comparacion.json').subscribe(data => {
      this.comparacionData = data;
      this.debugReady = true;
    });
  }

  // cambiarModulo redefinido más abajo con lógica de debugger

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.moduloKey = params.get('modulo') || '';
      this.mostrarComparador = false;
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

  // seleccionarEjercicio redefinido más abajo con lógica de debugger

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
    this.mostrarComparador = true;
    // Reiniciar debugger al mostrar comparador
    this.lineaActualIndex = 0;
    this.actualizarLineaComparacion();
  }

  avanzarLineaComparacion() {
    if (!this.debugReady) return;
    // Avanza a la siguiente línea si hay más
    if (this.lineaActualIndex + 1 < this.totalLineas) {
      this.lineaActualIndex++;
      this.actualizarLineaComparacion();
    }
  }

  actualizarLineaComparacion() {
    // Busca el objeto de comparación según el módulo y ejercicio
    if (!this.comparacionData || !this.moduloKey || !this.ejercicioSeleccionado) {
      this.lineaActual = null;
      this.totalLineas = 0;
      return;
    }
    const moduloObj = this.comparacionData[this.moduloKey];
    if (!moduloObj) {
      this.lineaActual = null;
      this.totalLineas = 0;
      return;
    }
    const ejercicioObj = moduloObj[this.ejercicioSeleccionado];
    if (!ejercicioObj) {
      this.lineaActual = null;
      this.totalLineas = 0;
      return;
    }
    // Se asume que las líneas están alineadas por índice
    const linesRacket = ejercicioObj.racket?.lines || [];
    const linesOcaml = ejercicioObj.ocaml?.lines || [];
    const explanationsRacket = ejercicioObj.explanations_racket || [];
    const explanationsOcaml = ejercicioObj.explanations_ocaml || [];
    const comparisons = ejercicioObj.comparisons || [];
    this.totalLineas = Math.max(
      linesRacket.length,
      linesOcaml.length,
      explanationsRacket.length,
      explanationsOcaml.length,
      comparisons.length
    );
    // Proteger el índice
    if (this.lineaActualIndex >= this.totalLineas) {
      this.lineaActualIndex = this.totalLineas - 1;
    }
    this.lineaActual = {
      lineaRacket: linesRacket[this.lineaActualIndex] || '',
      lineaOcaml: linesOcaml[this.lineaActualIndex] || '',
      explanationRacket: explanationsRacket[this.lineaActualIndex] || '',
      explanationOcaml: explanationsOcaml[this.lineaActualIndex] || '',
      comparison: comparisons[this.lineaActualIndex] || ''
    };
  }

  // Cuando se cambia de ejercicio, reiniciar debugger
  seleccionarEjercicio(key: string) {
    this.ejercicioSeleccionado = key;
    this.actualizarEjercicio();
    this.mostrarComparador = false;
    this.lineaActualIndex = 0;
    this.actualizarLineaComparacion();
  }

  // Si se cambia de módulo, reiniciar debugger
  cambiarModulo(direccion: number) {
    const nuevoIdx = this.moduloActualIndex + direccion;
    if (nuevoIdx >= 0 && nuevoIdx < this.modulos.length) {
      this.moduloActualIndex = nuevoIdx;
      const page = this.modulos[nuevoIdx].page;
      if (page) {
        this.mostrarComparador = false;
        this.router.navigate(['/' + page]);
        this.lineaActualIndex = 0;
        this.actualizarLineaComparacion();
      }
    }
  }


}
