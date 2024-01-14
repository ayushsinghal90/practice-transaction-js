const router = require("express").Router();
const user = require("../controller/user");

router.post("", user.register);
router.get("/all", user.fetchAll);
router.get("/:username", user.fetchUserByUsername);

module.exports = router;
