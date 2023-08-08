const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const usersRouter = require("./route/Users/usersRouters");
const {
  notFound,
  globalErrHandler,
} = require("./middlewares/globalErrHandler");
const categoryRouter = require("./route/category/categoryRouter");
const commentRouter = require("./route/comment/commentRouter");
const postsRouter = require("./route/post/postRouter");

require("./config/database")();

// !Server
const app = express();

//!routes
app.use(express.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comment", commentRouter);

// not found
app.use(notFound);

// !error handling
app.use(globalErrHandler);

const server = http.createServer(app);
// !start the server here
const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`server is hot on port ${PORT}`));
