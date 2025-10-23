import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
  selector: 'app-code-switcher',
  templateUrl: './code-switcher.component.html',
  styleUrls: ['./code-switcher.component.css'],
  standalone: true,
  imports: [CommonModule, CodeEditorComponent]
})
export class CodeSwitcherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
