const router = require("express").Router();
const account = require("../controller/account");

router.post("", account.register);

module.exports = router;
