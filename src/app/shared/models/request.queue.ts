import { EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { tag } from 'rxjs-spy/cjs/operators';
import { create } from 'rxjs-spy';

export enum ETypeQueue {
    PROMISE = 1,
    OBSERVABLE
}

export interface IRequest {
    responseManager: Subject<any>,
    type: ETypeQueue,
    getObservable: () => Observable<any>,
    callback: () => Observable<any> | Promise<any>,
    execute: () => void,
}

export class Request implements IRequest {
    responseManager: Subject<any> = new Subject();

    constructor(
        public callback: () => Observable<any> | Promise<any>,
        public type: ETypeQueue = 2
    ) { }

    getObservable(): Observable<any> {
        return this.responseManager.asObservable();
    }

    execute() {
        switch (this.type) {
            case ETypeQueue.OBSERVABLE:
                (this.callback() as Observable<any>).subscribe(response => {
                    this.responseManager.next(response);
                });
                break;
            case ETypeQueue.PROMISE:
                (this.callback() as Promise<any>).then(response => {
                    this.responseManager.next(response);
                });
                break;
            default:
                (this.callback() as Observable<any>).subscribe(response => {
                    this.responseManager.next(response);
                });
        }
    }
}

export interface IRequestList {
    list: Request[];
    numberExecutions: number;
    addRequest: (request: Request) => Observable<any>;
    execute: () => void;
}


export class RequestManager implements IRequestList {
    numberExecutions: number = 0;
    list: Request[] = [];
    constructor() {
    }

    addRequest(request: Request): Observable<any> {
        this.list.push(request);
        return request.getObservable();
    }

    execute(): Observable<boolean> {
        let subscriptions = new Subscription();
        let response = new Subject<boolean>();
        let numRequest = this.list.length;


        this.list.forEach(item => {
            let sub = item
                .getObservable()
                .subscribe(() => {
                    numRequest--;
                    if (numRequest == 0) {
                        response.next();
                        subscriptions.unsubscribe();
                    }
                });
            subscriptions.add(sub);
            item.execute();
        });
        return response.asObservable();
    }
}
