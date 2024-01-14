const router = require("express").Router();
const transaction = require("../controller/transaction");

router.post("", transaction.completeTransaction);

module.exports = router;
