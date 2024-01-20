const fs = require("fs");

/**
 * Middleware function to log request and response details to a file.
 *
 * @param {string} filename - The name of the file to log to.
 * @returns {function} - Express middleware function.
 */
function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${Date.now()}: ${req.method}: ${req.path}\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = { logReqRes };
