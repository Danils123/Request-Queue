import { EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { tag } from 'rxjs-spy/cjs/operators';
import { create } from 'rxjs-spy';
import { RequestStack } from './RequestStack.model';

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
    execute: (instance: boolean) => void;
}


export class RequestManager implements IRequestList {
    list: Request[] = [];
    stack: RequestStack[] = [];
    numberExecutions: number = 0;
    isExecuting: boolean = false;

    constructor() { }
    /**
      *  Add any request to the manager list, you are going to receive a observable as a response
    */
    addRequest(request: Request): Observable<any> {
        this.list.push(request);
        return request.getObservable();
    }

    /**
      * Execute all request list at the same  time.
      * If you call execute method many time, every call will be stored in a stack and every will be executed one by one
    */
    execute(addToStack: boolean = true): Observable<boolean> {
        let subscriptions = new Subscription();
        let numRequest = this.list.length;

        if (addToStack) {
            this.stack.push(new RequestStack(new Subject<boolean>(), this));
        }

        if (this.stack.length === 1 || !this.isExecuting) {
            this.isExecuting = true;
            this.stack[0].manager.list.forEach(item => {
                let sub = item
                    .getObservable()
                    .subscribe(() => {
                        numRequest--;
                        if (numRequest == 0) {
                            this.stack[0].response.next();
                            subscriptions.unsubscribe();
                            this.isExecuting = false;
                            this.stack.shift();
                            if (this.stack.length > 0) {
                                this.execute(false);
                            }
                        }
                    });
                subscriptions.add(sub);
                item.execute();
            });
        }

        return this.stack[this.stack.length - 1].response.asObservable();
    }
}
