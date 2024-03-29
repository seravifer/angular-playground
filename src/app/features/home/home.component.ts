import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public rate = 3;

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
    {
      path: '/worker',
      title: 'Web Worker'
    },
    {
      path: '/material',
      title: 'Material Design'
    },
    {
      path: '/transloco',
      title: 'Transloco'
    },
  ];

  constructor() { }

  ngOnInit() {
    console.log(environment.envDemo);
  }

}
