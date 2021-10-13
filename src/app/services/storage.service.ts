import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private changeSubject = new Subject<string | null>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public change$ = this.changeSubject.asObservable();

  constructor() { }

  set<T = any>(key: string, data: T) {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
    this.changeSubject.next(key);
  }

  get<T = any>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key));
  }

  remove(key: string) {
    localStorage.removeItem(key);
    this.changeSubject.next(key);
  }

  clearAll() {
    this.changeSubject.next();
    localStorage.clear();
  }

}
