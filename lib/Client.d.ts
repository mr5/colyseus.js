import { Signal } from '@gamestdio/signals';
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
    constructor(url: string, options?: any);
    join<T>(roomName: string, options?: JoinOptions): Room<T>;
    rejoin<T>(roomName: string, sessionId: string): Room<{}>;
    getAvailableRooms(roomName: string, callback: (rooms: RoomAvailable[], err?: string) => void): void;
    close(): void;
    protected createRoom<T>(roomName: string, options?: any): Room<T>;
    protected createRoomRequest<T>(roomName: string, options: JoinOptions, reuseRoomInstance?: Room<T>, retryCount?: number): Room<T>;
    protected connect(colyseusid: string, options?: any): void;
    protected buildEndpoint(path?: string, options?: any): string;
    /**
     * @override
     */
    protected onMessageCallback(event: any): void;
}
