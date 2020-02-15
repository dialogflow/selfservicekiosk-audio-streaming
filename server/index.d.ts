export declare class App {
    static readonly PORT: number;
    private app;
    private server;
    private io;
    socketClient: SocketIO.Server;
    baseLang: string;
    constructor();
    private createApp;
    private createServer;
    private sockets;
    private listen;
}
export declare let app: App;
