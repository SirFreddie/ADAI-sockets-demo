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

  players: any[] = [];
  controlMap: any = {};
  public start() {
    this.wss.on("connection", (socket: Socket) => {
      console.log(`Client ${socket.id} connected`);

      const player = {
        x: 0,
        y: 0,
        id: socket.id,
      };
      this.players.push(player);

      socket.on("controls", (controls) => {
        this.controlMap[socket.id] = controls;
      });

      socket.on("disconnect", () => {
        this.players = this.players.filter((p) => p.id !== socket.id);
        console.log(`Client ${socket.id} disconnected`);
        this.wss.emit("playerDisconnected", socket.id);
      });
    });

    const tick = (delta: number) => {
      for (const player of this.players) {
        const playerControls = this.controlMap[player.id] ?? {};

        if (playerControls["left"]) player.x -= 2;
        if (playerControls["right"]) player.x += 2;
        if (playerControls["up"]) player.y -= 2;
        if (playerControls["down"]) player.y += 2;
      }

      this.wss.emit("players", this.players);
    };

    let lastUpdate = Date.now();
    setInterval(() => {
      const now = Date.now();
      tick(now - lastUpdate);
      lastUpdate = now;
    }, 1000 / 30);
  }
}
