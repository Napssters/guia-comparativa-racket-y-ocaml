import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-scheme';
import 'ace-builds/src-noconflict/mode-ocaml';

declare const ace: any;

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  standalone: true,
  imports: [NgClass, CommonModule]
})
export class CodeEditorComponent implements AfterViewInit {
  @Input() code: string = '';
  @Input() language: string = 'text';
  @Input() label: string = '';
  @Input() disabled: boolean = true;
  @Input() answer: string = '';
  @Input() showRunButton: boolean = true;
  @Input() highlightLine: number = 0;
  @Input() showOutput: boolean = false;
  @Input() enableHighlight: boolean = false;
  @ViewChild('editor') editorRef!: ElementRef;
  private editor: any;
  private highlightMarkerId: number | null = null;

  output: string = '';

  ngAfterViewInit() {
    this.editor = ace.edit(this.editorRef.nativeElement);
    const mode = this.language === 'scheme' || this.language === 'ocaml' ? this.language : 'text';
    this.editor.session.setMode(`ace/mode/${mode}`);
    this.editor.setValue(this.code || '', -1);
    this.editor.setReadOnly(this.disabled);
    // Si está en modo solo lectura, deshabilita selección y movimiento de cursor
    // El cursor siempre debe ser puntero
    this.editor.container.style.cursor = 'pointer';
    // Forzar el cursor pointer en todos los elementos internos del editor
    if (this.editor.container.querySelector('.ace_content')) {
      (this.editor.container.querySelector('.ace_content') as HTMLElement).style.cursor = 'pointer';
    }
    if (this.editor.container.querySelector('.ace_text-input')) {
      (this.editor.container.querySelector('.ace_text-input') as HTMLElement).style.cursor = 'pointer';
    }
    if (this.disabled) {
      this.editor.renderer.$cursorLayer.element.style.display = 'none';
      this.editor.setOptions({ highlightActiveLine: false, highlightGutterLine: false });
      this.editor.selection.clearSelection();
      this.editor.on('mousedown', (e: any) => {
        e.preventDefault();
        return false;
      });
      this.editor.on('keydown', (e: any) => {
        e.preventDefault();
        return false;
      });
    } else {
      this.editor.renderer.$cursorLayer.element.style.display = '';
      this.editor.setOptions({ highlightActiveLine: true, highlightGutterLine: true });
    }
    this.editor.session.setOption('useWorker', false);
    this.editor.on('change', () => {
      this.code = this.editor.getValue();
    });
    if (this.enableHighlight) {
      this.resaltarLinea();
    }
  }

  ejecutar() {
    this.output = this.answer;
  }

  ngOnChanges() {
    if (this.editor) {
      this.editor.setReadOnly(this.disabled);
      this.editor.setValue(this.code || '', -1);
      const mode = this.language === 'scheme' || this.language === 'ocaml' ? this.language : 'text';
      this.editor.session.setMode(`ace/mode/${mode}`);
      if (this.enableHighlight) {
        this.resaltarLinea();
      }
    }
    // Si showOutput es true, mostrar el answer en output
    if (this.showOutput) {
      this.output = this.answer;
    } else {
      this.output = '';
    }
  }

  resaltarLinea() {
    if (!this.editor) return;
    // Elimina marcador anterior si existe
    if (this.highlightMarkerId !== null) {
      this.editor.session.removeMarker(this.highlightMarkerId);
      this.highlightMarkerId = null;
    }
    // Resalta la línea indicada (0-based)
    const Range = ace.require('ace/range').Range;
    const line = this.highlightLine || 0;
    this.highlightMarkerId = this.editor.session.addMarker(
      new Range(line, 0, line, 1),
      'ace_active-line',
      'fullLine'
    );
    // Lleva el cursor a la línea resaltada
    this.editor.scrollToLine(line, true, true, function () {});
  }

  // Devuelve el offsetTop (en píxeles) de la línea resaltada en el editor
  public getHighlightedLineOffset(): number {
    if (!this.editor || typeof this.highlightLine !== 'number') return 0;
    // Ace: obtener el nodo DOM de la línea resaltada
    const line = this.highlightLine || 0;
    const lineElements = this.editor.renderer.layerConfig && this.editor.renderer.$textLayer.element.children;
    if (lineElements && lineElements[line]) {
      const el = lineElements[line] as HTMLElement;
      return el.offsetTop + el.offsetHeight;
    }
    return 0;
  }
}
