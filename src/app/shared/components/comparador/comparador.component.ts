
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
  isPrevDisabled(): boolean {
    if (this.modulo === 'recursion') {
      return this.recursionStepIndex <= 0;
    }
    return this.highlightLineRacket <= 0;
  }

  isNextDisabled(): boolean {
    if (this.modulo === 'recursion' && this.comparacionData && this.comparacionData['recursion'] && this.comparacionData['recursion'][this.ejercicio]) {
      const info = this.comparacionData['recursion'][this.ejercicio];
      const stepsR = info.racket && Array.isArray(info.racket.recursion) ? info.racket.recursion.length : 0;
      const stepsO = info.ocaml && Array.isArray(info.ocaml.recursion) ? info.ocaml.recursion.length : 0;
      const maxSteps = Math.max(stepsR, stepsO);
      return this.recursionStepIndex >= maxSteps - 1;
    }
    return this.highlightLineRacket >= this.maxLineRacket - 1;
  }
  recursionStepIndex = 0;
  showCardsLeft = true;
  answerSegmentado: string[] = [];
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
      if (this.modulo === 'recursion' && info.racket && Array.isArray(info.racket.recursion)) {
        this.recursionStepIndex = 0;
        this.highlightLineRacket = info.racket.recursion[0] || 0;
        if (info.ocaml && Array.isArray(info.ocaml.recursion)) {
          this.highlightLineOcaml = info.ocaml.recursion[0] || 0;
        } else {
          this.highlightLineOcaml = 0;
        }
      } else {
        this.highlightLineRacket = 0;
        this.highlightLineOcaml = 0;
      }
      // Segmentar answer solo para los módulos requeridos
      if (["paradigma-funcional", "expresiones"].includes(this.modulo) && this.answer) {
        this.answerSegmentado = this.answer.split('\n');
      } else {
        this.answerSegmentado = [];
      }
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
      this.answerSegmentado = [];
      this.recursionStepIndex = 0;
    }
  }
  getAnswerParcial(): string {
    if (this.answerSegmentado.length === 0) return '';
    return this.answerSegmentado.slice(0, this.highlightLineRacket + 1).join('\n');
  }

  // Actualiza las explicaciones según la línea resaltada
  actualizarExplicaciones() {
    if (
      this.comparacionData &&
      this.comparacionData[this.modulo] &&
      this.comparacionData[this.modulo][this.ejercicio]
    ) {
      const info = this.comparacionData[this.modulo][this.ejercicio];
      // Modo recursion: usar el índice de línea real de cada lenguaje
      if (this.modulo === 'recursion' && info.racket && Array.isArray(info.racket.recursion)) {
        const idxR = info.racket.recursion[this.recursionStepIndex] || 0;
        const idxO = (info.ocaml && Array.isArray(info.ocaml.recursion)) ? (info.ocaml.recursion[this.recursionStepIndex] || 0) : 0;
        this.explicacionRacket = (info.explanations_racket && info.explanations_racket[idxR]) ? info.explanations_racket[idxR] : '';
        this.explicacionOcaml = (info.explanations_ocaml && info.explanations_ocaml[idxO]) ? info.explanations_ocaml[idxO] : '';
        // Comparación: mostrar la correspondiente a la línea de Racket, o la de OCaml si no existe
        if (info.comparisons && info.comparisons[idxR]) {
          this.explicacionComparacion = info.comparisons[idxR];
        } else if (info.comparisons && info.comparisons[idxO]) {
          this.explicacionComparacion = info.comparisons[idxO];
        } else {
          this.explicacionComparacion = '';
        }
      } else {
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
      }
    } else {
      this.explicacionRacket = '';
      this.explicacionComparacion = '';
      this.explicacionOcaml = '';
    }
  }

  cambiarLinea(delta: number) {
    if (this.modulo === 'recursion' && this.comparacionData && this.comparacionData['recursion'] && this.comparacionData['recursion'][this.ejercicio]) {
      const info = this.comparacionData['recursion'][this.ejercicio];
      const recursionStepsRacket = info.racket && Array.isArray(info.racket.recursion) ? info.racket.recursion : [];
      const recursionStepsOcaml = info.ocaml && Array.isArray(info.ocaml.recursion) ? info.ocaml.recursion : [];
      let nuevoPaso = this.recursionStepIndex + delta;
      if (nuevoPaso >= 0 && nuevoPaso < recursionStepsRacket.length) {
        this.recursionStepIndex = nuevoPaso;
        this.highlightLineRacket = recursionStepsRacket[nuevoPaso];
        if (recursionStepsOcaml.length > 0) {
          this.highlightLineOcaml = recursionStepsOcaml[nuevoPaso] || 0;
        } else {
          this.highlightLineOcaml = 0;
        }
        // Output solo si es el último paso
        this.mostrarOutput = (nuevoPaso === recursionStepsRacket.length - 1);
        this.actualizarExplicaciones();
        this.showCardsLeft = !this.showCardsLeft;
      }
    } else {
      let nueva = this.highlightLineRacket + delta;
      if (nueva >= 0 && nueva < this.maxLineRacket) {
        this.highlightLineRacket = nueva;
        this.highlightLineOcaml = Math.min(nueva, this.maxLineOcaml - 1);
        // Mostrar output en cada paso para los módulos requeridos
        if (["paradigma-funcional", "expresiones"].includes(this.modulo)) {
          this.mostrarOutput = true;
        } else {
          this.mostrarOutput = (this.highlightLineRacket === this.maxLineRacket - 1);
        }
        this.actualizarExplicaciones();
        this.showCardsLeft = !this.showCardsLeft;
      }
    }
  }

  abrirModal() {
    this.showModal = true;
    this.showCardsLeft = true;
    // Forzar recarga de datos y reinicio de índices
    this.recursionStepIndex = 0;
    this.highlightLineRacket = 0;
    this.highlightLineOcaml = 0;
    if (["paradigma-funcional", "expresiones"].includes(this.modulo)) {
      this.mostrarOutput = true;
    } else {
      this.mostrarOutput = false;
    }
    this.cargarComparacion();
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
