import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  get<T>(url: string): Observable<T[]> {
    return new Observable(observer => {
      fetch(url)
        .then(response => response.json()) // or text() or blob() etc.
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }

  post() { }

  put() { }

  delete() { }
}
