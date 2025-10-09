import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comparador',
  templateUrl: './comparador.component.html',
  styleUrls: ['./comparador.component.css']
})
export class ComparadorComponent implements OnInit {
  @Input() lineaRacket: string = '';
  @Input() lineaOcaml: string = '';
  @Input() explanationRacket: string = '';
  @Input() explanationOcaml: string = '';
  @Input() comparison: string = '';

  constructor() { }

  ngOnInit() {
  }
}
