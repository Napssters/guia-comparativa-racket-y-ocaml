import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-code-switcher',
  templateUrl: './code-switcher.component.html',
  styleUrls: ['./code-switcher.component.css'],
  standalone: true,
  imports: [CommonModule, CodeEditorComponent, HttpClientModule, FormsModule, RouterModule]
})
export class CodeSwitcherComponent implements OnInit {
  @ViewChild(CodeEditorComponent) codeEditor!: CodeEditorComponent;
  code: string = '';
  selectedPracticaKey: string = '';
  openToastIndex: number|null = null;
  titulo = '';
  lenguaje = 'ocaml';
  currentRoute = '';
  practicas: any = { racket: {}, ocaml: {} };
  Object = Object;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      if (segments.length > 0) {
        const raw = segments[0].path;
        
        this.resetPracticas()
        this.currentRoute = raw;
        this.titulo = raw
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        this.loadPracticas(raw);
      }
    });
  }

  isPracticaRoute(): boolean {
    return this.currentRoute === 'practica-racket' || this.currentRoute === 'practica-ocaml';
  }

  shouldShowComponent(): boolean {
    return this.currentRoute !== 'paradigma-funcional';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openToast(index: number) {
    this.openToastIndex = index;
  }

  closeToast(event?: MouseEvent) {
    if (event) {
      // Only close if clicking outside the toast
      if ((event.target as HTMLElement).classList.contains('bg-black')) {
        this.openToastIndex = null;
      }
    } else {
      this.openToastIndex = null;
    }
  }

  loadPracticas(url: string) {
    this.http.get('assets/json-base/practica.json').subscribe((data: any) => {
      const seccion = data[url];
      
      if (seccion) {
        const lenguajesDisponibles = Object.keys(seccion);
        this.lenguaje = lenguajesDisponibles[0];
        
        if (seccion[this.lenguaje]) {
          this.practicas = seccion;
          const keys = Object.keys(seccion[this.lenguaje]);
          if (keys.length > 0) {
            this.selectedPracticaKey = keys[0];
          }
        }
      }
    });
  }

  onPracticaChange() {
    if (this.codeEditor) {
      this.codeEditor.clearEditor();
    }
  }

  resetPracticas() {
    this.practicas = {};
    this.selectedPracticaKey = '';
    this.code = '';
    this.lenguaje = '';
    if (this.codeEditor) {
      this.codeEditor.clearEditor();
    }
  }
}
