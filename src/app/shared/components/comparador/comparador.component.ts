import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comparador',
  templateUrl: './comparador.component.html',
  styleUrls: ['./comparador.component.css'],
  standalone: true,
  imports: [CommonModule, CodeEditorComponent]
})
export class ComparadorComponent implements OnInit {
  mostrarOutput = false;
  maxLineRacket = 1;
  maxLineOcaml = 1;
  @Input() modulo: string = '';
  @Input() ejercicio: string = '';
  @Input() answer: string = '';
  @Input() highlightLineRacket: number = 0;
  @Input() highlightLineOcaml: number = 0;

  comparacionData: any = null;
  racketLines: string = '';
  ocamlLines: string = '';
  showModal: boolean = false;

  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.cargarComparacion();
  }

  cargarComparacion() {
    this.http.get('assets/json-base/comparacion.json').subscribe((data: any) => {
      this.comparacionData = data;
      this.actualizarLineas();
    });
  }

  actualizarLineas() {
    if (
      this.comparacionData &&
      this.comparacionData[this.modulo] &&
      this.comparacionData[this.modulo][this.ejercicio]
    ) {
      const info = this.comparacionData[this.modulo][this.ejercicio];
      this.racketLines = (info.racket && info.racket.lines) ? info.racket.lines.join('\n') : '';
      this.ocamlLines = (info.ocaml && info.ocaml.lines) ? info.ocaml.lines.join('\n') : '';
      this.maxLineRacket = (info.racket && info.racket.lines) ? info.racket.lines.length : 1;
      this.maxLineOcaml = (info.ocaml && info.ocaml.lines) ? info.ocaml.lines.length : 1;
      // Por defecto resalta la primera línea
      this.highlightLineRacket = 0;
      this.highlightLineOcaml = 0;
    } else {
      this.racketLines = '';
      this.ocamlLines = '';
      this.maxLineRacket = 1;
      this.maxLineOcaml = 1;
      this.highlightLineRacket = 0;
      this.highlightLineOcaml = 0;
    }
  }

  cambiarLinea(delta: number) {
    const nueva = this.highlightLineRacket + delta;
    if (nueva >= 0 && nueva < this.maxLineRacket) {
      this.highlightLineRacket = nueva;
      this.highlightLineOcaml = Math.min(nueva, this.maxLineOcaml - 1);
      this.mostrarOutput = (this.highlightLineRacket === this.maxLineRacket - 1);
    }
  }

  abrirModal() {
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.highlightLineRacket = 0;
    this.highlightLineOcaml = 0;
    this.mostrarOutput = false;
  }

  ngOnChanges() {
    if (this.comparacionData) {
      this.actualizarLineas();
    }
  }
}
