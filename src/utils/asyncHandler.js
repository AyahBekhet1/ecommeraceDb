export const GlobalErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ msgs: err.message  , stack:err.stack});
  next()
};

export const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      next(error);
    });
  };
};
