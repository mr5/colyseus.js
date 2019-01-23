import WebSocketClient from '@gamestdio/websocket';
export declare class Connection extends WebSocketClient {
    private _enqueuedCalls;
    constructor(url: any, autoConnect?: boolean, options?: {});
    onOpenCallback(event: any): void;
    send(data: any): void;
}
