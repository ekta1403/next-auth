const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
 
  res.status(status).json({
    success: false,
    status,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack:err.stack
    //stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
 
export { errorHandler };