const router = require("express").Router();
const health = require("../controller/health");

router.get("", health);

module.exports = router;
