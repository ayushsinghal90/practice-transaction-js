const router = require("express").Router();
const transaction = require("../controller/transaction");

router.post("", transaction.startPayment);

module.exports = router;
