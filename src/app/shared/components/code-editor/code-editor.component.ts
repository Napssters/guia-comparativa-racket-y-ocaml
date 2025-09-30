
import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
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
  imports: [NgClass]
})
export class CodeEditorComponent implements AfterViewInit {
  @Input() code: string = '';
  @Input() language: string = 'text';
  @Input() label: string = '';
  @Input() disabled: boolean = true;
  @ViewChild('editor') editorRef!: ElementRef;
  private editor: any;

  ngAfterViewInit() {
    this.editor = ace.edit(this.editorRef.nativeElement);
    this.editor.setTheme('ace/theme/github');
    const mode = this.language === 'scheme' || this.language === 'ocaml' ? this.language : 'text';
    this.editor.session.setMode(`ace/mode/${mode}`);
    this.editor.setValue(this.code || '', -1);
    this.editor.setReadOnly(this.disabled);
    this.editor.session.setOption('useWorker', false);
    this.editor.on('change', () => {
      this.code = this.editor.getValue();
    });
  }

  ngOnChanges() {
    if (this.editor) {
      this.editor.setReadOnly(this.disabled);
      this.editor.setValue(this.code || '', -1);
      const mode = this.language === 'scheme' || this.language === 'ocaml' ? this.language : 'text';
      this.editor.session.setMode(`ace/mode/${mode}`);
    }
  }
}
