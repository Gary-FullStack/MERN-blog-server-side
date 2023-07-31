const http = require("http");
const express = require("express");

// !Server
const app = express();

const server = http.createServer(app);

// ?start the server here
const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`server is hot on port ${PORT}`));
