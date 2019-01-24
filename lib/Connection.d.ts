declare const WebSocketClient: any;
import { Options } from 'reconnectingwebsocket';
export declare class Connection extends WebSocketClient {
    private _enqueuedCalls;
    private listeners;
    constructor(url: any, autoConnect?: boolean, options?: Options);
    onopen: (event: any) => void;
}
export {};
