const globalErrHandler = (err, req, res, next) => {
  const status = err?.status ? err?.status : "failed";
  const message = err?.message;
  const stack = err?.stack;
  res.status(500).json({
    status,
    message,
    stack,
  });
};

// not found
const notFound = (req, res, next) => {
  const error = new Error(
    `Can not locate - ${req.originalUrl} on this server.`
  );
  next(error);
};

module.exports = { notFound, globalErrHandler };
