import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class ComparadorComponent implements OnInit, AfterViewInit {
  showCardsLeft = true;
  // Referencias a los editores de código
  @ViewChild('racketEditor') racketEditorRef: any;
  @ViewChild('ocamlEditor') ocamlEditorRef: any;

  // (offsets eliminados, ya no se usan)
  mostrarOutput = false;
  maxLineRacket = 1;
  maxLineOcaml = 1;

  // Explicaciones actuales para la línea resaltada
  explicacionRacket: string = '';
  explicacionComparacion: string = '';
  explicacionOcaml: string = '';
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

  ngAfterViewInit() {}

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
      this.actualizarExplicaciones();
    } else {
      this.racketLines = '';
      this.ocamlLines = '';
      this.maxLineRacket = 1;
      this.maxLineOcaml = 1;
      this.highlightLineRacket = 0;
      this.highlightLineOcaml = 0;
      this.explicacionRacket = '';
      this.explicacionComparacion = '';
      this.explicacionOcaml = '';
    }
  }

  // Actualiza las explicaciones según la línea resaltada
  actualizarExplicaciones() {
    if (
      this.comparacionData &&
      this.comparacionData[this.modulo] &&
      this.comparacionData[this.modulo][this.ejercicio]
    ) {
      const info = this.comparacionData[this.modulo][this.ejercicio];
      const idx = this.highlightLineRacket;
      // Explicación Racket
      if (info.explanations_racket && info.explanations_racket[idx]) {
        this.explicacionRacket = info.explanations_racket[idx];
      } else {
        this.explicacionRacket = '';
      }
      // Explicación OCaml
      if (info.explanations_ocaml && info.explanations_ocaml[idx]) {
        this.explicacionOcaml = info.explanations_ocaml[idx];
      } else {
        this.explicacionOcaml = '';
      }
      // Comparación
      if (info.comparisons && info.comparisons[idx]) {
        this.explicacionComparacion = info.comparisons[idx];
      } else {
        this.explicacionComparacion = '';
      }
    } else {
      this.explicacionRacket = '';
      this.explicacionComparacion = '';
      this.explicacionOcaml = '';
    }
  }

  cambiarLinea(delta: number) {
    const nueva = this.highlightLineRacket + delta;
    if (nueva >= 0 && nueva < this.maxLineRacket) {
      this.highlightLineRacket = nueva;
      this.highlightLineOcaml = Math.min(nueva, this.maxLineOcaml - 1);
      this.mostrarOutput = (this.highlightLineRacket === this.maxLineRacket - 1);
      this.actualizarExplicaciones();
      // Alternar lado de los cards
      this.showCardsLeft = !this.showCardsLeft;
    }
  }

  abrirModal() {
    this.showModal = true;
    this.showCardsLeft = true;
    this.actualizarExplicaciones();
  }

  cerrarModal() {
    this.showModal = false;
    this.highlightLineRacket = 0;
    this.highlightLineOcaml = 0;
    this.mostrarOutput = false;
    this.actualizarExplicaciones();
  }

  ngOnChanges() {
    if (this.comparacionData) {
      this.actualizarLineas();
    }
  }

  onOverlayClick(event: MouseEvent) {
    this.cerrarModal();
  }
}
