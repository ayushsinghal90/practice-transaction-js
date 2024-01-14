const router = require("express").Router();
const transaction = require("../controller/transaction");

router.post("", transaction.makePayment);

module.exports = router;
