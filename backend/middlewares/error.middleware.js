// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("🚨 Error occurred:", err);

  // Default error
  let error = {
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    error.message = message;
    error.statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  // Firestore errors
  if (err.code === "permission-denied") {
    error.message = "Permission denied";
    error.statusCode = 403;
  }

  if (err.code === "not-found") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  if (err.code === "already-exists") {
    error.message = "Resource already exists";
    error.statusCode = 409;
  }

  if (err.code === "failed-precondition") {
    error.message = "Operation failed due to precondition";
    error.statusCode = 412;
  }

  if (err.code === "aborted") {
    error.message = "Operation was aborted";
    error.statusCode = 409;
  }

  if (err.code === "out-of-range") {
    error.message = "Value is out of range";
    error.statusCode = 400;
  }

  if (err.code === "unimplemented") {
    error.message = "Operation is not implemented";
    error.statusCode = 501;
  }

  if (err.code === "internal") {
    error.message = "Internal server error";
    error.statusCode = 500;
  }

  if (err.code === "unavailable") {
    error.message = "Service is currently unavailable";
    error.statusCode = 503;
  }

  if (err.code === "data-loss") {
    error.message = "Unrecoverable data loss or corruption";
    error.statusCode = 500;
  }

  if (err.code === "unauthenticated") {
    error.message = "Authentication required";
    error.statusCode = 401;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }

  // Set default status code
  const statusCode = error.statusCode || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(process.env.NODE_ENV === "development" && { error: err })
  });
};

module.exports = errorHandler;
