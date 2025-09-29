import { isPlatformBrowser, NgIf } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

import { Component } from '@angular/core';
import { ModulosComponent } from '../modulos/modulos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  imports: [ModulosComponent, RouterModule, NgIf],
  standalone: true
})
export class MainPageComponent {
  showMore = false;
  isDesktop = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 768;
    }
  }
}
