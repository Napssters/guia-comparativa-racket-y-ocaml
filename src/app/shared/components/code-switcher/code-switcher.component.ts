import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-code-switcher',
  templateUrl: './code-switcher.component.html',
  styleUrls: ['./code-switcher.component.css'],
  standalone: true,
  imports: [CommonModule, CodeEditorComponent]
})
export class CodeSwitcherComponent implements OnInit {
  titulo = '';
  lenguaje = 'ocaml';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      if (segments.length > 0) {
        const raw = segments[0].path;
        this.titulo = raw
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        this.lenguaje = raw === 'practica-racket' ? 'scheme' : 'ocaml';
      }
    });
  }
}
