import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RemoveNumberPipe } from '../../pipes/remove-number.pipe';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RemoveNumberPipe]
})
export class DocumentacionComponent implements OnInit, OnChanges {
  @Input() moduloKey: string = '';
  moduloData: any = null;
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadModulo();
  }

  ngOnChanges() {
    this.loadModulo();
  }

  loadModulo() {
    if (!this.moduloKey) {
      this.moduloData = null;
      return;
    }
    this.http.get<any[]>('assets/json-base/documentacion.json').subscribe({
      next: (data) => {
        const found = data.find((item: any) => item[this.moduloKey]);
        this.moduloData = found ? found[this.moduloKey] : null;
      },
      error: () => {
        this.moduloData = null;
      }
    });
  }
}
