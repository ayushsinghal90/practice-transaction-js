const router = require("express").Router();
const user = require("../controller/user");

router.post("", user.register);

module.exports = router;
