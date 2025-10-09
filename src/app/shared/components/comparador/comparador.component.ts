import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comparador',
  templateUrl: './comparador.component.html',
  styleUrls: ['./comparador.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ComparadorComponent implements OnInit {
  @Input() lineaRacket: string = '';
  @Input() lineaOcaml: string = '';
  @Input() explanationRacket: string = '';
  @Input() explanationOcaml: string = '';
  @Input() comparison: string = '';
  @Output() avanzarLinea = new EventEmitter<void>();

  showToast: boolean = false;
  toastTimeout: any;
  // El toast usará directamente los @Input actuales

  constructor() { }

  ngOnInit() {}

  // Solo se llama manualmente desde el padre
  mostrarToastYAvanzar() {
    this.avanzarLinea.emit();
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    setTimeout(() => {
      this.showToast = true;
      // Ya no se cierra automáticamente
    }, 50);
  }

  cerrarToast() {
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}
