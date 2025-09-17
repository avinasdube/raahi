// Server entry point
const app = require("./app");
const http = require("http");
const config = require("./config/config");

const server = http.createServer(app);

const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
