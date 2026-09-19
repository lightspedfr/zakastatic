import { wispurr } from "wispurr";
import { createServer } from "node:http";

const wisp = new wispurr({ port: 6001, logLevel: "info" });
await wisp.start(4); // spawn 4 workers, which would route to 6001, 6002, 6003, and 6004 or similar automatically

const server = createServer();
server.on("upgrade", (req, socket, head) => wisp.route(req, socket, head));
server.listen(3000);
