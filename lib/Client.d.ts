import { Signal } from '@gamestdio/signals';
import { Options } from 'reconnectingwebsocket';
import { Connection } from './Connection';
import { Room, RoomAvailable } from './Room';
export declare type JoinOptions = {
    retryTimes: number;
    requestId: number;
} & any;
export declare class Client {
    id?: string;
    onOpen: Signal;
    onMessage: Signal;
    onClose: Signal;
    onError: Signal;
    protected connection: Connection;
    protected rooms: {
        [id: string]: Room;
    };
    protected connectingRooms: {
        [id: string]: Room;
    };
    protected requestId: number;
    protected hostname: string;
    protected roomsAvailableRequests: {
        [requestId: number]: (value?: RoomAvailable[]) => void;
    };
    constructor(url: string, options?: any, connectOptions?: Options);
    join<T>(roomName: string, options?: JoinOptions, reuseRoomInstance?: Room<T>, retryCount?: number): Room<T>;
    rejoin<T>(roomName: string, sessionId: string, reuseRoomInstance?: Room<T>, retryCount?: number): Room<T>;
    getAvailableRooms(roomName: string, callback: (rooms: RoomAvailable[], err?: string) => void): void;
    close(): void;
    refresh(): void;
    open(): void;
    protected createRoom<T>(roomName: string, options?: any): Room<T>;
    protected createRoomRequest<T>(roomName: string, options: JoinOptions, reuseRoomInstance?: Room<T>, retryCount?: number): Room<T>;
    protected connect(colyseusid: string, options?: any, connectOptions?: any): void;
    protected buildEndpoint(path?: string, options?: any): string;
    /**
     * @override
     */
    protected onMessageCallback(event: any): void;
}
