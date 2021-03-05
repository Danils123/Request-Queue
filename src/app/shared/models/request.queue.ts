import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ETypeQueque {
    PROMISE = 1,
    OBSERVABLE
}

export interface IRequest {
    managerResponse: Subject<any>,
    type: ETypeQueque,
    getObservable: () => Observable<any>,
    callback: () => Observable<any> | Promise<any>,
    execute: () => void,
}

export class Request implements IRequest {
    managerResponse: Subject<any> = new Subject();

    constructor(
        public callback: () => Observable<any> | Promise<any>,
        public type: ETypeQueque = 2
    ) { }

    getObservable(): Observable<any> {
        return this.managerResponse.asObservable();
    }

    execute() {
        switch (this.type) {
            case ETypeQueque.OBSERVABLE:
                (this.callback() as Observable<any>).subscribe(response => {
                    this.managerResponse.next(response);
                });
                break;
            case ETypeQueque.PROMISE:
                (this.callback() as Promise<any>).then(response => {
                    this.managerResponse.next(response);
                });
                break;
            default:
                (this.callback() as Observable<any>).subscribe(response => {
                    this.managerResponse.next(response);
                });
        }
    }
}

export interface IRequestQueue {
    numRequest: number;
    response: EventEmitter<boolean>;
    queue: Request[];
    addRequest: (request: Request) => Observable<any>;
    execute: () => void;
}


export class RequestQueue implements IRequestQueue {
    numRequest: number = 0;
    response = new EventEmitter();
    queue: Request[] = [];
    constructor() { }

    addRequest(request: Request) {
        this.queue.push(request);
        return request.getObservable();
    }

    execute(): EventEmitter<boolean> {
        this.numRequest = this.queue.length;
        this.queue.forEach(item => {
            item.getObservable().subscribe(() => {
                this.numRequest--;
                if (this.numRequest == 0) {
                    this.response.emit();
                }
            });

            item.execute();
        });
        return this.response;
    }
}