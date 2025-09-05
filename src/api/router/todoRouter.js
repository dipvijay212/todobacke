const router = require("express").Router();
const todoController = require("../controller/todoController");
const isAuthenticated = require("../../middleware/auth");

router.use(isAuthenticated);
router.post("/", todoController.todoCreate);
router.get("/", todoController.getTodo);
router.get("/:id", todoController.getTodoById);
router.delete("/:id", todoController.todoDeletedAt);
router.put("/:id", todoController.todoUpdate);

module.exports = router; 