
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
    const recCheck = this.getRecursionInfo();
    if (recCheck) {
      return this.recursionStepIndex <= 0;
    }
    return this.highlightLineRacket <= 0;
  }

  isNextDisabled(): boolean {
    const recCheck = this.getRecursionInfo();
    if (recCheck) {
      const stepsR = recCheck.racket && Array.isArray(recCheck.racket.recursion) ? recCheck.racket.recursion.length : 0;
      const stepsO = recCheck.ocaml && Array.isArray(recCheck.ocaml.recursion) ? recCheck.ocaml.recursion.length : 0;
      const maxSteps = Math.max(stepsR, stepsO);
      return this.recursionStepIndex >= maxSteps - 1;
    }
    return this.highlightLineRacket >= this.maxLineRacket - 1;
  }
  recursionStepIndex = 0;
  // Output independiente para listas y recursión
  outputRacket: string = '';
  outputOcaml: string = '';
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
      // Inicializar índices y output para listas y recursión
      const recCheck = this.getRecursionInfo();
      if (recCheck) {
        this.recursionStepIndex = 0;
        this.highlightLineRacket = (recCheck.racket && Array.isArray(recCheck.racket.recursion)) ? (recCheck.racket.recursion[0] || 0) : 0;
        this.highlightLineOcaml = (recCheck.ocaml && Array.isArray(recCheck.ocaml.recursion)) ? (recCheck.ocaml.recursion[0] || 0) : 0;
        // Output inicial independiente para cada lenguaje
        const recursionStepsRacket = recCheck.racket && Array.isArray(recCheck.racket.recursion) ? recCheck.racket.recursion : [];
        const recursionStepsOcaml = recCheck.ocaml && Array.isArray(recCheck.ocaml.recursion) ? recCheck.ocaml.recursion : [];
        const stepAnswerRacket = recCheck.racket && Array.isArray(recCheck.racket['recursion-step-answer']) ? recCheck.racket['recursion-step-answer'] : [];
        const stepAnswerOcaml = recCheck.ocaml && Array.isArray(recCheck.ocaml['recursion-step-answer']) ? recCheck.ocaml['recursion-step-answer'] : [];
        // Racket output
        let zeroCountRacket = 0;
        let lastZeroIndexRacket = -1;
        for (let i = 0; i < recursionStepsRacket.length; i++) {
          if (recursionStepsRacket[i] === 0) lastZeroIndexRacket = i;
        }
        if (recursionStepsRacket.length > 0 && recursionStepsRacket[0] === 0) zeroCountRacket = 1;
        if (recursionStepsRacket.length > 0 && recursionStepsRacket[0] === 0 && 0 === lastZeroIndexRacket) {
          this.outputRacket = this.answer;
        } else if (recursionStepsRacket.length > 0 && recursionStepsRacket[0] === 0 && 0 !== lastZeroIndexRacket) {
          this.outputRacket = String(stepAnswerRacket[zeroCountRacket - 1] ?? '');
        } else {
          this.outputRacket = '';
        }
        // OCaml output
        let zeroCountOcaml = 0;
        let lastZeroIndexOcaml = -1;
        for (let i = 0; i < recursionStepsOcaml.length; i++) {
          if (recursionStepsOcaml[i] === 0) lastZeroIndexOcaml = i;
        }
        if (recursionStepsOcaml.length > 0 && recursionStepsOcaml[0] === 0) zeroCountOcaml = 1;
        if (recursionStepsOcaml.length > 0 && recursionStepsOcaml[0] === 0 && 0 === lastZeroIndexOcaml) {
          this.outputOcaml = this.answer;
        } else if (recursionStepsOcaml.length > 0 && recursionStepsOcaml[0] === 0 && 0 !== lastZeroIndexOcaml) {
          this.outputOcaml = String(stepAnswerOcaml[zeroCountOcaml - 1] ?? '');
        } else {
          this.outputOcaml = '';
        }
        this.mostrarOutput = true;
      } else {
        this.highlightLineRacket = 0;
        this.highlightLineOcaml = 0;
        this.outputRacket = '';
        this.outputOcaml = '';
        this.mostrarOutput = false;
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
      // Si el ejercicio define arrays de pasos (recursion), usarlos para mapear explicaciones
      const recInfo = this.getRecursionInfo();
      if (recInfo) {
        const idxR = recInfo.racket && Array.isArray(recInfo.racket.recursion) ? (recInfo.racket.recursion[this.recursionStepIndex] || 0) : 0;
        const idxO = recInfo.ocaml && Array.isArray(recInfo.ocaml.recursion) ? (recInfo.ocaml.recursion[this.recursionStepIndex] || 0) : 0;
        this.explicacionRacket = (recInfo.explanations_racket && recInfo.explanations_racket[idxR]) ? recInfo.explanations_racket[idxR] : '';
        this.explicacionOcaml = (recInfo.explanations_ocaml && recInfo.explanations_ocaml[idxO]) ? recInfo.explanations_ocaml[idxO] : '';
        // Comparación: preferir la correspondiente a la línea de Racket, o la de OCaml si no existe
        if (recInfo.comparisons && recInfo.comparisons[idxR]) {
          this.explicacionComparacion = recInfo.comparisons[idxR];
        } else if (recInfo.comparisons && recInfo.comparisons[idxO]) {
          this.explicacionComparacion = recInfo.comparisons[idxO];
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
    const recInfo = this.getRecursionInfo();
    if (recInfo) {
      const recursionStepsRacket = recInfo.racket && Array.isArray(recInfo.racket.recursion) ? recInfo.racket.recursion : [];
      const recursionStepsOcaml = recInfo.ocaml && Array.isArray(recInfo.ocaml.recursion) ? recInfo.ocaml.recursion : [];
      const maxSteps = Math.max(recursionStepsRacket.length, recursionStepsOcaml.length);
      let nuevoPaso = this.recursionStepIndex + delta;
      if (nuevoPaso >= 0 && nuevoPaso < maxSteps) {
        this.recursionStepIndex = nuevoPaso;
        // --- Racket ---
        let idxR = nuevoPaso < recursionStepsRacket.length ? nuevoPaso : recursionStepsRacket.length - 1;
        this.highlightLineRacket = recursionStepsRacket.length > 0 ? recursionStepsRacket[idxR] : 0;
        const stepAnswerRacket = recInfo.racket && Array.isArray(recInfo.racket['recursion-step-answer']) ? recInfo.racket['recursion-step-answer'] : [];
        let zeroCountRacket = 0;
        let lastZeroIndexRacket = -1;
        for (let i = 0; i < recursionStepsRacket.length; i++) {
          if (recursionStepsRacket[i] === 0) lastZeroIndexRacket = i;
        }
        for (let i = 0; i <= Math.min(nuevoPaso, recursionStepsRacket.length - 1); i++) {
          if (recursionStepsRacket[i] === 0) zeroCountRacket++;
        }
        if (nuevoPaso >= lastZeroIndexRacket && lastZeroIndexRacket !== -1) {
          this.outputRacket = this.answer;
        } else if (zeroCountRacket) {
          this.outputRacket = String(stepAnswerRacket[zeroCountRacket - 1] ?? '');
        } else {
          this.outputRacket = '';
        }
        // --- OCaml ---
        let idxO = nuevoPaso < recursionStepsOcaml.length ? nuevoPaso : recursionStepsOcaml.length - 1;
        this.highlightLineOcaml = recursionStepsOcaml.length > 0 ? recursionStepsOcaml[idxO] : 0;
        const stepAnswerOcaml = recInfo.ocaml && Array.isArray(recInfo.ocaml['recursion-step-answer']) ? recInfo.ocaml['recursion-step-answer'] : [];
        let zeroCountOcaml = 0;
        let lastZeroIndexOcaml = -1;
        for (let i = 0; i < recursionStepsOcaml.length; i++) {
          if (recursionStepsOcaml[i] === 0) lastZeroIndexOcaml = i;
        }
        for (let i = 0; i <= Math.min(nuevoPaso, recursionStepsOcaml.length - 1); i++) {
          if (recursionStepsOcaml[i] === 0) zeroCountOcaml++;
        }
        if (nuevoPaso >= lastZeroIndexOcaml && lastZeroIndexOcaml !== -1) {
          this.outputOcaml = this.answer;
        } else if (zeroCountOcaml) {
          this.outputOcaml = String(stepAnswerOcaml[zeroCountOcaml - 1] ?? '');
        } else {
          this.outputOcaml = '';
        }
        this.mostrarOutput = true;
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

  // Devuelve la entrada del JSON para el ejercicio actual si define arrays de pasos (recursion)
  getRecursionInfo(): any | null {
    if (!this.comparacionData || !this.modulo || !this.ejercicio) return null;
    const moduleData = this.comparacionData[this.modulo];
    if (!moduleData) return null;
    const exercise = moduleData[this.ejercicio];
    if (!exercise) return null;
    // Considerar válido si racket.recursion o ocaml.recursion es un array
    if ((exercise.racket && Array.isArray(exercise.racket.recursion)) || (exercise.ocaml && Array.isArray(exercise.ocaml.recursion))) {
      return exercise;
    }
    return null;
  }

  // Devuelve el array de respuestas por paso si existe (recursion-step-answer)
  getStepAnswerArray(exercise: any): any[] | null {
    if (!exercise) return null;
    // Buscar en racket
    if (exercise.racket && Array.isArray(exercise.racket['recursion-step-answer'])) {
      return exercise.racket['recursion-step-answer'];
    }
    // Buscar en ocaml
    if (exercise.ocaml && Array.isArray(exercise.ocaml['recursion-step-answer'])) {
      return exercise.ocaml['recursion-step-answer'];
    }
    return null;
  }
}
