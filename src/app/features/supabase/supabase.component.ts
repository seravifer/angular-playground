import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-supabase',
  templateUrl: './supabase.component.html',
  styleUrls: ['./supabase.component.scss'],
})
export class SupabaseComponent implements OnInit {
  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {}
}
