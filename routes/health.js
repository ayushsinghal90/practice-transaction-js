const router = require("express").Router();
const health = require("../controller/health");

router.post("", health);

module.exports = router;
