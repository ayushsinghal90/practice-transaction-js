class ServerFailure extends Error {
  constructor(message) {
    super(message);

    // Set the name of your custom error
    this.name = "ServerFailure";
    this.status = 500;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServerFailure;
