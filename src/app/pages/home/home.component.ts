import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public menu = [
    {
      path: '/error',
      title: 'ErrorHandler'
    },
    {
      path: '/reactive-form',
      title: 'Reactive Forms'
    },
    {
      path: '/interceptor',
      title: 'HttpInterceptor'
    },
  ];

  constructor() { }

}
