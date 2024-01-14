const router = require("express").Router();
const account = require("../controller/account");

router.post("", account.register);
router.get("/:username", account.findUserAccount);

module.exports = router;
