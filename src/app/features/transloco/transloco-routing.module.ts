import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoComponent } from './transloco.component';

const routes: Routes = [{ path: '', component: TranslocoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslocoRoutingModule { }
