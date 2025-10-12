import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RemoveNumberPipe } from '../../pipes/remove-number.pipe';
import { PrismHighlightPipe } from '../../pipes/prism-highlight.pipe';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RemoveNumberPipe, PrismHighlightPipe]
})
export class DocumentacionComponent implements OnInit, OnChanges {
  @Input() moduloKey: string = '';
  moduloData: any = null;
  codigosExpresiones: {racket: any[]; ocaml: any[]} | null = null;
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadModulo();
  }

  ngOnChanges() {
    this.loadModulo();
  }

  loadModulo() {
    if (!this.moduloKey) {
      this.moduloData = null;
      this.codigosExpresiones = null;
      return;
    }
    this.http.get<any[]>('assets/json-base/documentacion.json').subscribe({
      next: (data) => {
        const found = data.find((item: any) => item[this.moduloKey]);
        this.moduloData = found ? found[this.moduloKey] : null;
        // Si el módulo tiene la llave 'codigos', extraer y mostrar
        if (this.moduloData && this.moduloData.codigos) {
          this.codigosExpresiones = {
            racket: this.getFormattedCodigos(this.moduloData.codigos.racket, 'racket'),
            ocaml: this.getFormattedCodigos(this.moduloData.codigos.ocaml, 'ocaml')
          };
        } else {
          this.codigosExpresiones = null;
        }
      },
      error: () => {
        this.moduloData = null;
        this.codigosExpresiones = null;
      }
    });
  }

  /**
   * Procesa los códigos para separar el resultado y mostrarlo bonito
   */
  getFormattedCodigos(codigos: any[], lang: 'racket'|'ocaml') {
    if (!Array.isArray(codigos)) return [];
    return codigos.map(c => {
      let code = c.code || '';
      let result = '';
      // Buscar el separador de resultado
      if (lang === 'racket') {
        // Busca ; Resultado: ... o ;Resultado: ...
        const match = code.match(/; ?Resultado: ?(.+)/);
        if (match) {
          result = match[1].trim();
          code = code.replace(/; ?Resultado: ?(.+)/, '').trim();
        }
      } else if (lang === 'ocaml') {
        // Busca ;; (* Resultado: ... *) o ; Resultado: ...
        let match = code.match(/;; \(\* ?Resultado: ?(.+?) ?\*\)/);
        if (match) {
          result = match[1].trim();
          code = code.replace(/;; \(\* ?Resultado: ?(.+?) ?\*\)/, ';;').trim();
        } else {
          // Alternativa: ; Resultado: ...
          match = code.match(/; ?Resultado: ?(.+)/);
          if (match) {
            result = match[1].trim();
            code = code.replace(/; ?Resultado: ?(.+)/, '').trim();
          }
        }
      }
      return {
        title: c.title || c.name || '',
        code,
        result
      };
    });
  }
}
