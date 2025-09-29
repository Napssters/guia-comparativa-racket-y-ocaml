import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css'],
  imports: [RouterModule, CodeEditorComponent],
  standalone: true
})
export class ModuloComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  racketCode: string = `#lang racket
  (define (suma-pares lst)
    (cond
      [(empty? lst) 0]
      [(even? (first lst)) (+ (first lst) (suma-pares (rest lst)))]
      [else (suma-pares (rest lst))]))

  (suma-pares '(1 2 3 4 5 6)) ; Resultado: 12
  `;
  ocamlCode: string = `let rec suma_pares lst =
    match lst with
    | [] -> 0
    | x :: xs -> if x mod 2 = 0 then x + suma_pares xs else suma_pares xs

  let () =
    let resultado = suma_pares [1;2;3;4;5;6] in
    Printf.printf "%d\n" resultado (* Resultado: 12 *)
  `;

}
