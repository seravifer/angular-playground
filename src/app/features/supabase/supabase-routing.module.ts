import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupabaseComponent } from './supabase.component';

const routes: Routes = [{ path: '', component: SupabaseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupabaseRoutingModule { }
