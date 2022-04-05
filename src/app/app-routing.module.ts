import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./features/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'reactive-form',
    loadChildren: () =>
      import('./features/reactive-form/reactive-form.module').then(
        (m) => m.ReactiveFormModule
      ),
  },
  {
    path: 'interceptor',
    loadChildren: () =>
      import('./features/interceptor/interceptor.module').then(
        (m) => m.InterceptorModule
      ),
  },
  {
    path: 'worker',
    loadChildren: () =>
      import('./features/worker/worker.module').then((m) => m.WorkerModule),
  },
  {
    path: 'material',
    loadChildren: () =>
      import('./features/material/material.module').then(
        (m) => m.MaterialModule
      ),
  },
  {
    path: 'transloco',
    loadChildren: () =>
      import('./features/transloco/transloco.module').then(
        (m) => m.TranslocoModule
      ),
  },
  {
    path: 'upload-file',
    loadChildren: () =>
      import('./features/upload-file/upload-file.module').then(
        (m) => m.UploadFileModule
      ),
  },
  {
    path: 'primeng',
    loadChildren: () =>
      import('./features/primeng/primeng.module').then((m) => m.PrimengModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
