"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// import WebSocketClient from '@gamestdio/websocket';
var reconnectingwebsocket_1 = require("reconnectingwebsocket");
var msgpack = require("./msgpack");
var Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection(url, autoConnect, options) {
        if (autoConnect === void 0) { autoConnect = true; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, url, undefined, Object.assign({ automaticOpen: autoConnect, binaryType: 'arraybuffer' }, options)) || this;
        _this._enqueuedCalls = [];
        return _this;
    }
    Object.defineProperty(Connection.prototype, "onopen", {
        get: function () {
            var self = this;
            return function (event) {
                if (self.listeners.onopen) {
                    self.listeners.onopen.apply(null, [event]);
                }
                if (self._enqueuedCalls.length > 0) {
                    for (var _i = 0, _a = self._enqueuedCalls; _i < _a.length; _i++) {
                        var _b = _a[_i], method = _b[0], args = _b[1];
                        self[method].apply(self, args);
                    }
                    // clear enqueued calls.
                    self._enqueuedCalls = [];
                }
            };
        },
        set: function (listener) {
            this.listeners.onopen = listener;
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.send = function (data) {
        if (this.readyState === reconnectingwebsocket_1.default.OPEN) {
            return _super.prototype.send.call(this, msgpack.encode(data));
        }
        else {
            // WebSocket not connected.
            // Enqueue data to be sent when readyState == OPEN
            this._enqueuedCalls.push(['send', [data]]);
        }
    };
    return Connection;
}(reconnectingwebsocket_1.default));
exports.Connection = Connection;
