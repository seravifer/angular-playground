import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterceptorRoutingModule } from './interceptor-routing.module';
import { InterceptorComponent } from './interceptor.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor.service';

@NgModule({
  declarations: [InterceptorComponent],
  imports: [
    CommonModule,
    InterceptorRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class InterceptorModule { }
