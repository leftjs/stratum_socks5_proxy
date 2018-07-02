import net from "net";
import ldj from "ndjson";
import config from "./config.json";
import proxysocket from "proxysocket";
import { resolve } from "upath";

export default class MinersController {
  constructor() {
    this.miners = new Map();
    this.id = 10;
    this.listener = net
      .createServer(conn => {
        let socket = proxysocket.create(config.proxy.host, config.proxy.port);
        const miner = new Miner(conn, socket);
        this.miners.set(this.id++, miner);
        console.log(`活跃的矿工数${this.miners.size}`);
      })
      .listen(config.port);
  }
}

class Miner {
  constructor(connection, socket) {
    console.log("新矿工连接");
    this.connection = connection;
    this.status = "offline";
    this.socket = socket;
    this.connection.on("error", err => this.onError(err));
    this.connection
      .on("data", () => {})
      .pipe(ldj.parse({ strict: true }))
      .on("data", data => this.onData(data))
      .on("error", e => console.log(`无效的矿工请求${e}`));
    this.connection.on("end", () => this.onEnd());

    this.socket.on("data", data => {
      const result = Buffer.from(data).toString();
      console.log(`接收到矿池反馈${result}`);
      this.send(result);
    });
  }

  connectToPool() {
    return new Promise((resolve, _) => {
      this.socket.connect(
        config.pool.host,
        config.pool.port,
        () => {
          console.log("成功连接到矿池");
          resolve("online");
        }
      );
    });
  }

  onError(err) {
    console.log(`矿工${this.id}出错:${err}`);
  }

  async onData(data) {
    console.log(`接受到矿机请求: ${JSON.stringify(data)}`);
    if (this.status == "offline") {
      console.log("矿池连接尚未完成,正在连接矿池...");
      this.status = await this.connectToPool();
      this.onData(data);
    } else {
      this.socket.write(JSON.stringify(data) + "\n");
    }
  }

  send(result) {
    console.log(`发送${result}到矿机`);
    this.connection.write(result);
  }

  onEnd() {
    if (this.socket) {
      this.socket.end();
      delete this.socket;
      this.socket = null;
    }
  }
}
