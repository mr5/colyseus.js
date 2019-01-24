// import WebSocketClient from '@gamestdio/websocket';
import WebSocketClient, {Options} from 'reconnectingwebsocket';
import {EntityMap} from './index';
import * as msgpack from './msgpack';

export class Connection extends WebSocketClient {

    private _enqueuedCalls: any[] = [];
    private listeners: EntityMap<(eventy: any) => void>;

    constructor(url, autoConnect: boolean = true, options: Options = {}) {
        super(url, undefined, Object.assign({automaticOpen: autoConnect, binaryType: 'arraybuffer'}, options));
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


    public send(data: any): void {
        if (this.readyState === WebSocketClient.OPEN) {
            return super.send(msgpack.encode(data));

        } else {
            // WebSocket not connected.
            // Enqueue data to be sent when readyState == OPEN
            this._enqueuedCalls.push(['send', [data]]);
        }
    }
}
