import { Subject } from 'rxjs';
import { RequestManager } from './request.queue';
export interface IRequestStack {
    response: Subject<boolean>,
    manager: RequestManager
}

export class RequestStack implements IRequestStack {
    constructor(
        public response: Subject<boolean>,
        public manager: RequestManager
    ) { }
}