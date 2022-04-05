import { UploadService } from './features/upload-file/upload.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public menu = [
    {
      path: '/error',
      title: 'ErrorHandler',
    },
    {
      path: '/reactive-form',
      title: 'Reactive Forms',
    },
    {
      path: '/interceptor',
      title: 'HttpInterceptor',
    },
    {
      path: '/worker',
      title: 'Web Worker',
    },
    {
      path: '/material',
      title: 'Material Design',
    },
    {
      path: '/transloco',
      title: 'Transloco',
    },
    {
      path: '/upload-file',
      title: 'Upload file',
    },
    {
      path: '/primeng',
      title: 'PrimeNG',
    },
  ];

  constructor(public uploadService: UploadService) {}
}
