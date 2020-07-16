const Server = require("../dist/server/RealtimeServer");
const server = new Server.default();
server.listen(1337);
console.log("got so far");
