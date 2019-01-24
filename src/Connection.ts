// import WebSocketClient from '@gamestdio/websocket';
const WebSocketClient = require('reconnectingwebsocket');
import {Options} from 'reconnectingwebsocket';
import {EntityMap} from './index';
import * as msgpack from './msgpack';

export class Connection extends WebSocketClient {

    private _enqueuedCalls: any[] = [];
    private listeners: EntityMap<(eventy: any) => void> = {};

    constructor(url, autoConnect: boolean = true, options: Options = {}) {
        super(url, undefined, Object.assign({automaticOpen: autoConnect, binaryType: 'arraybuffer'}, options));
        const parentSend = this.send;
        const self = this;
        this.send = (data: any): void => {
            if (self.readyState === WebSocketClient.OPEN) {
                return parentSend(msgpack.encode(data));
            } else {
                // WebSocket not connected.
                // Enqueue data to be sent when readyState == OPEN
                self._enqueuedCalls.push(['send', [data]]);
            }
        };
    }

    set onopen(listener: (event: any) => void) {
        this.listeners.onopen = listener;
    }

    get onopen() {
        const self = this;
        return (event: any) => {
            if (self.listeners.onopen) {
                self.listeners.onopen.apply(null, [event]);
            }
            if (self._enqueuedCalls.length > 0) {
                for (const [method, args] of self._enqueuedCalls) {
                    self[method].apply(self, args);
                }

                // clear enqueued calls.
                self._enqueuedCalls = [];
            }
        };
    }
}
