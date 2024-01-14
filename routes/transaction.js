const router = require("express").Router();
const transaction = require("../controller/transaction");

router.post("", transaction.startPayment);
router.get("/:userId", transaction.findUserPayments);

module.exports = router;
