const isAuthenticated = require("../../middleware/auth");
const upload = require("../../middleware/fileupload");
const userController = require("../controller/userController");
const router = require("express").Router();
router.post("/signup", upload.single("profileImage"), userController.signup);
router.post("/login",  userController.login);

router.use(isAuthenticated);
router.get("/profile", userController.userGetProfile);
router.put("/update", upload.single("profileImage"), userController.updateUser);
router.delete("/delete", userController.deleteUser);
module.exports = router;