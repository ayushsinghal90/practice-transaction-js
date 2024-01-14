const User = require("../config/db").User;

async function register(req, res) {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
  });
  return res.status(200).json(user);
}

module.exports = {
  register,
};
