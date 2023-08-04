const http = require("http");
const express = require("express");
const { use } = require("./route/Users/usersRouters");
const usersRouter = require("./route/Users/usersRouters");
const {
  notFound,
  globalErrHandler,
} = require("./middlewares/globalErrHandler");
require("./config/database")();

// !Server
const app = express();

//!middleware
app.use(express.json());
app.use("/api/v1/users", usersRouter);

// not found
app.use(notFound);

// !error handling
app.use(globalErrHandler);

const server = http.createServer(app);
// !start the server here
const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`server is hot on port ${PORT}`));
