
import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ModuloComponent } from './pages/modulo/modulo.component';

export const routes: Routes = [
	{
		path: '',
		component: MainPageComponent
	},
	{
		path: ':modulo',
		component: ModuloComponent
	}
];
