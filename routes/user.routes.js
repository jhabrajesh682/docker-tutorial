const router = require("express").Router();
const users = require("../collection/user.controller");
const user = new users();



/****************************************API Routes for users************************************/

router.post("/", user.createUser);

router.get("/", user.getAllUsers);


router.put("/:id", user.getOneAndUpdateUser);

router.delete("/:id", user.getOneAndDeleteUser);

router.post("/auth", user.authenticateUsers);


module.exports = router