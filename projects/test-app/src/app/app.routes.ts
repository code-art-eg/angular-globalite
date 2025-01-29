import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NumberPipeExampleComponent } from './number-pipe-example/number-pipe-example.component';
import { DatePipeExampleComponent } from './date-pipe-example/date-pipe-example.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, title: 'Home' },
	{
		path: 'gnumber',
		component: NumberPipeExampleComponent,
		title: 'gnumber',
	},
	{
		path: 'gdate',
		component: DatePipeExampleComponent,
		title: 'gdate',
	},
];
