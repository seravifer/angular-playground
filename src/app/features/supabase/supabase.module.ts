import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupabaseRoutingModule } from './supabase-routing.module';
import { SupabaseComponent } from './supabase.component';

@NgModule({
  declarations: [SupabaseComponent],
  imports: [CommonModule, SupabaseRoutingModule],
})
export class SupabaseModule {}
