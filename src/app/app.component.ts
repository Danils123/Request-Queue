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
  title = 'Request-Orquestrator';

  constructor(
    private ps: PostService
  ) { }

  ngOnInit() {


    const orquestrator = new RequestManager();

    let postsMethod = this.ps.get;
    let postsMethod2 = this.ps.get;

    orquestrator.addRequest(new Request(postsMethod)).subscribe(response => console.log("Solicitud #1 finalizó"));
    orquestrator.addRequest(new Request(postsMethod2)).subscribe(response => console.log("Solicitud #2 finalizó"));

    orquestrator.execute().subscribe(() => {
      console.log("Todas las solicitudes finalizaron");
    });

    orquestrator.addRequest(new Request(postsMethod2)).subscribe(response => console.log("Solicitud #3 finalizó"));

    orquestrator.execute().subscribe(() => {
      console.log("Todas las solicitudes finalizaron");
    });


    // orquestrator.execute().asObservable().subscribe(response => console.log("Todas las solicitudes finalizaron"));


  }


}
