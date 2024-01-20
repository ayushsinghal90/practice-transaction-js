/**
 * Checks the results of an array of promises and throws an error if any of them rejected.
 *
 * @param {PromiseSettledResult[]} results - Array of settled promise results.
 */
function checkPromiseResults(results) {
  results.forEach((promiseResult) => {
    if (promiseResult.status === "rejected") {
      throw promiseResult.reason;
    }
  });
}

module.exports = {
  checkPromiseResults,
};
