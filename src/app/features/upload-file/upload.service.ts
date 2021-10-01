import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private progress = new Subject<number>();

  constructor(
    private http: HttpClient
  ) { }

  testHelloWorld() {
    return this.http.get('/api/');
  }

  upload(formData: FormData) {
    return this.http.post<any>('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return { status: 'progress', message: progress };
          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }

  uploadAsync(formData: FormData) {
    this.progress.next(0);
    this.http.post<any>('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress.next(Math.round(100 * event.loaded / event.total));
            break;
        }
      })
    ).subscribe();
    return this.progress;
  }

  getProgress() {
    return this.progress;
  }

}
