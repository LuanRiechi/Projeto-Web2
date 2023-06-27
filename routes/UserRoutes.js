const router = require("express").Router();

const UserController = require("../controllers/UserController");
const verifyToken = require("../helpers/check-token");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/:id", UserController.getUserById);
router.patch(
    "/edit",
    verifyToken,
    UserController.editUser
  );

router.delete("/delete",verifyToken, UserController.removeUser)

module.exports = router;