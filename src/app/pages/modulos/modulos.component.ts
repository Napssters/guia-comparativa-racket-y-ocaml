import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Modulo } from '../../interfaces/modulo.interface';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
  standalone: true,
  imports: [CommonModule, NgClass, RouterModule]
})
export class ModulosComponent implements OnInit {
  modulos: Modulo[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Modulo[]>('assets/json-base/modulos.json').subscribe(data => {
      this.modulos = data;
    });
  }

  getDificultadColor(dificultad: string): string {
    switch (dificultad.toLowerCase()) {
      case 'principiante':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'avanzado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'elemental':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getDificultadBorder(dificultad: string): string {
    switch (dificultad.toLowerCase()) {
      case 'principiante':
        return 'border-green-300';
      case 'medio':
        return 'border-yellow-300';
      case 'avanzado':
        return 'border-red-300';
      case 'elemental':
        return 'border-blue-300';
      default:
        return 'border-gray-300';
    }
  }
}
