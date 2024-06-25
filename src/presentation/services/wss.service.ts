import { Socket, Server as WebSocketServer } from "socket.io";
import { Server } from "http";

interface Options {
  server: Server;
  path?: string;
}

export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: Options) {
    const { server, path = "/ws" } = options;

    this.wss = new WebSocketServer(server);
    this.start();
  }

  static get instance(): WssService {
    if (!WssService._instance) {
      throw new Error("WssService not initialized");
    }

    return WssService._instance;
  }

  static initWss(options: Options) {
    WssService._instance = new WssService(options);
  }

  public start() {
    this.wss.on("connection", (socket: Socket) => {
      console.log(`Client ${socket.id} connected`);
      socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }
}
