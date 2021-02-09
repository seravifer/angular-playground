import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: 'reactive-form',
    loadChildren: () => import('./pages/reactive-form/reactive-form.module').then(m => m.ReactiveFormModule)
  },
  {
    path: 'interceptor',
    loadChildren: () => import('./pages/interceptor/interceptor.module').then(m => m.InterceptorModule)
  },
  {
    path: 'worker',
    loadChildren: () => import('./pages/worker/worker.module').then(m => m.WorkerModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
