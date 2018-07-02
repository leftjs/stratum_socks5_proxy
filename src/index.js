import "source-map-support/register";
import MinersController from "./miners_controller";
// import proxysocket from "proxysocket";
// import config from "./config.json";
// const socket = proxysocket.create(config.proxy.host, config.proxy.port);

// socket.connect(
//   config.pool.host,
//   config.pool.port,
//   () => {
//     console.log("成功连接到矿池");
//     socket.write(JSON.stringify({ id: 1, method: "mining.subscribe", params: ["zealot/enemy-1.12t2"] }));
//   }
// );

// socket.on("data", data => {
//   console.log(Buffer.from(data).toString());
// });
function main() {
  let minerController = new MinersController();
}

main();
