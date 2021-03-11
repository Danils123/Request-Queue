import { Component, enableProdMode, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestManager, Request } from "./shared/models/request.queue";
import { PostService } from './core/services/post.service';
import { create } from 'rxjs-spy';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Request-manager';

  constructor(
    private ps: PostService
  ) { }

  ngOnInit() {


    const manager = new RequestManager();

    let postsMethod = this.ps.get;
    let postsMethod2 = this.ps.get;

    manager.addRequest(new Request(postsMethod)).subscribe(response => console.log("Solicitud #1 finalizó"));
    manager.addRequest(new Request(postsMethod2)).subscribe(response => console.log("Solicitud #2 finalizó"));

    manager.execute().subscribe(() => {
      console.log("Todas las solicitudes finalizaron #1");
    });

    manager.addRequest(new Request(postsMethod2)).subscribe(response => console.log("Solicitud #3 finalizó"));

    manager.execute().subscribe(() => {
      console.log("Todas las solicitudes finalizaron #2");
    });

    // manager.addRequest(new Request(postsMethod2)).subscribe(response => console.log("Solicitud #4 finalizó"));

    // manager.execute().subscribe(() => {
    //   console.log("Todas las solicitudes finalizaron #3");
    // });


    // manager.execute().asObservable().subscribe(response => console.log("Todas las solicitudes finalizaron"));


  }


}
