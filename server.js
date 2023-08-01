const http = require("http");
const express = require("express");
const { use } = require("./route/Users/usersRouters");
const usersRouter = require("./route/Users/usersRouters");

// !Server
const app = express();

//!middleware
app.use("/", usersRouter);

const server = http.createServer(app);

// !start the server here
const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`server is hot on port ${PORT}`));
