
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { DocumentacionComponent } from '../../shared/components/documentacion/documentacion.component';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css'],
  imports: [RouterModule, CommonModule, NgClass, CodeEditorComponent, DocumentacionComponent],
  standalone: true
})
export class ModuloComponent implements OnInit {
  // Propiedades y métodos de la clase Angular
  moduloKey: string = '';
  ejercicios: { [key: string]: any } = {};
  ejerciciosKeys: string[] = [];
  ejercicioSeleccionado: string = '';
  descripcionEjercicio: string = '';
  racketCode: string = '';
  ocamlCode: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.moduloKey = params.get('modulo') || '';
      this.cargarEjercicios();
    });
  }

  cargarEjercicios() {
    this.http.get<any>('assets/json-base/ejercicios.json').subscribe(data => {
      if (data[this.moduloKey]) {
        this.ejercicios = data[this.moduloKey];
        this.ejerciciosKeys = Object.keys(this.ejercicios).sort();
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
    this.ocamlCode = '';
  }

  mostrarConversion() {
    const ejercicio = this.ejercicios[this.ejercicioSeleccionado];
    this.ocamlCode = ejercicio?.ocaml?.code || '';
  }
}
