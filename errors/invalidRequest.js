class InvalidRequest extends Error {
  constructor(message) {
    super(message);

    // Set the name of your custom error
    this.name = "InvalidRequest";
    this.status = 400;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = InvalidRequest;
