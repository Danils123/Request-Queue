import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../shared/models/Post.model';
import { ApiService } from './api.service';
import { tag } from 'rxjs-spy/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  static instance: PostService;
  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    PostService.instance = this;
  }


  get(): Observable<Post[]> {

    // Solución #1
    // return this.api.get<Post>("https://jsonplaceholder.typicode.com/posts");

    // Solución #2
    return PostService.instance.api.get<Post>("https://jsonplaceholder.typicode.com/posts");


    // Solución #3
    // return new Observable(observer => {
    //   fetch("https://jsonplaceholder.typicode.com/posts")
    //     .then(response => response.json()) // or text() or blob() etc.
    //     .then((data: Post[]) => {
    //       observer.next(data);
    //       observer.complete();
    //     })
    //     .catch(err => observer.error(err));
    // });

    // Solución #4
    // return PostService.instance.http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");

    // return this.http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  }
}
