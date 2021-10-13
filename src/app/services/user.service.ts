import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  // constructor(private http: HttpClient) { }

  requestData(): Observable<any> {
    return of('string');
    /*const url = '/api/bad';
    return this.http.get(url).pipe(
      map(res => {
        console.log('map', res);
        return res;
      })
    );*/
  }

  requestPromise(): Promise<string> {
    return Promise.resolve('string');
  }

  requestObservable(): Observable<string> {
    return of('string');
  }

  requestValue() {
    return 'My string';
  }

}
