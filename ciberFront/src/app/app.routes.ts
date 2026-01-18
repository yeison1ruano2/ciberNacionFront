import { Routes } from '@angular/router';
import { TareaComponent } from './features/tarea/components/tarea/tarea.component';
import { ProyectoComponent } from './features/proyecto/components/proyecto/proyecto.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: ProyectoComponent,
  },
  {
    path: 'proyecto/:id/tareas',
    component: TareaComponent,
  },
];
