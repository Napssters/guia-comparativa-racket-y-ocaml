import { Component, Input, OnInit } from '@angular/core';
import { AceModule } from 'ngx-ace-wrapper';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-scheme';
import 'ace-builds/src-noconflict/mode-ocaml';
import 'ace-builds/src-noconflict/theme-monokai';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  standalone: true,
  imports: [AceModule]
})

export class CodeEditorComponent implements OnInit {
  @Input() code: string = '';
  @Input() language: string = 'text';
  @Input() label: string = '';
  @Input() disabled: boolean = true;

  constructor() { }

  ngOnInit() {}

  onAceLoaded(editor: any) {
    // Solo se usan los modos y tema importados estáticamente
    const mode = this.language === 'scheme' || this.language === 'ocaml' ? this.language : 'text';
    const theme = 'monokai';
    // Desactiva el worker para evitar errores
    editor.session.setOption('useWorker', false);
    // Establece el modo y tema
    editor.session.setMode(`ace/mode/${mode}`);
    editor.setTheme(`ace/theme/${theme}`);
    // Solo lectura si disabled
    editor.setReadOnly(this.disabled);
  }
}
