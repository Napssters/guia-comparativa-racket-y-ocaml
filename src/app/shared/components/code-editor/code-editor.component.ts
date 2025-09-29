import { Component, Input, OnInit } from '@angular/core';
import { AceModule } from 'ngx-ace-wrapper';
// Importar Ace y los modos/temas necesarios
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-scheme';
import 'ace-builds/src-noconflict/mode-ocaml';

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
    // Desactiva el worker para evitar errores
    editor.session.setOption('useWorker', false);
    // Vuelve a establecer el modo después de desactivar el worker
    const currentMode = editor.session.getMode().$id;
    editor.session.setMode(currentMode);
    // Solo lectura
    editor.setReadOnly(this.disabled);
  }
}
