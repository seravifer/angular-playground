import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimengComponent } from './primeng.component';

const routes: Routes = [{ path: '', component: PrimengComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimengRoutingModule { }
