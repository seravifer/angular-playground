import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) { }

  requestData() {
    const url = '/api/bad';
    return this.http.get(url).pipe(
      map(res => {
        console.log('map', res);
        return res;
      })
    );
  }
}
