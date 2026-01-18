import { Routes } from '@angular/router';
import { TareaComponent } from './features/tarea/components/tarea/tarea.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: TareaComponent,
  },
];
