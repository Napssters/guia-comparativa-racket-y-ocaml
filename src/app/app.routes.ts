
import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ModuloComponent } from './pages/modulo/modulo.component';
import { CodeSwitcherComponent } from './shared/components/code-switcher/code-switcher.component';

export const routes: Routes = [
	{
		path: '',
		component: MainPageComponent
	},
	{
		path: 'practica-ocaml',
		component: CodeSwitcherComponent
	},
	{
		path: 'practica-racket',
		component: CodeSwitcherComponent
	},
	{
		path: ':modulo',
		component: ModuloComponent
	}
];
