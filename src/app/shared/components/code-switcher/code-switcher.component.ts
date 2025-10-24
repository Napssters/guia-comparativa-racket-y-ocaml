import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PracticasPorLenguaje } from './practica.model';
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
  practicas: any = { racket: {}, ocaml: {} };
  Object = Object;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      if (segments.length > 0) {
        const raw = segments[0].path;
        this.titulo = raw
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        this.lenguaje = raw === 'practica-racket' ? 'racket' : 'ocaml';
        this.loadPracticas();
      }
    });
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

  loadPracticas() {
    this.http.get('assets/json-base/practica.json').subscribe(data => {
      this.practicas = data;
      const keys = Object.keys(this.practicas[this.lenguaje]);
      if (keys.length > 0) {
        this.selectedPracticaKey = keys[0];
        this.code = '';
      }
    });
  }

  onPracticaChange() {
    this.code = '';
    if (this.codeEditor) {
      this.codeEditor.clearEditor();
    }
  }
}
