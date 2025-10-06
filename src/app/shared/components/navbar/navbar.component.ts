import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class NavbarComponent implements OnInit {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToModulos() {
    const modulosSection = document.getElementById('modulos');
    if (modulosSection) {
      const yOffset = -80; // Ajusta el offset según el alto de tu navbar
      const y = modulosSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      modulosSection.classList.add('modulos-highlight');
      setTimeout(() => {
        modulosSection.classList.remove('modulos-highlight');
      }, 800);
    }
  }
  modulos: any[] = [];
  isDropdownOpen = false;
  private clickListener: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get<any[]>('assets/json-base/modulos.json').subscribe(data => {
      this.modulos = data;
    });

    // Listener global para cerrar el menú al hacer click fuera
    this.clickListener = (event: MouseEvent) => {
      const menu = document.querySelector('.relative');
      if (this.isDropdownOpen && menu && !menu.contains(event.target as Node)) {
        this.closeDropdown();
      }
    };
    document.addEventListener('mousedown', this.clickListener);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  isActiveModulo(page: string): boolean {
    // Obtiene el último segmento de la URL actual
    const urlSegments = this.router.url.split('/').filter(Boolean);
    const lastSegment = urlSegments[urlSegments.length - 1];
    return lastSegment === page;
  }

  isRootRoute(): boolean {
    return this.router.url === '/';
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.clickListener);
  }
}
