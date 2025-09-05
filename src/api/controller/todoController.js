const db = require("../../database/index");

const todoCreate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const user = await db.users.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if(title == "") {
      return res.status(400).json({ error: "title is required" });
    }
    const newTodo = await db.todos.create({
      title,
      description,
      userId,
    });
    return res.status(201).json({message: "Todo created successfully", todo: newTodo});
  } catch (error) {
    console.error("Error todo:", error);
    return res.status(500).json({ error: "error" });
  }
};

const getTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await db.todos.findAll({
      where: { userId, isDeleted: false },
    });
    return res.status(200).json(todos);
  } catch (error) {
    console.error("Error todo:", error);
    return res.status(500).json({ error: "error" });
  }
};
const getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;
    const todo = await db.todos.findOne({ where: { id: todoId, userId } });
    console.log(todo);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(200).json(todo);
  } catch (error) {
    console.error("Error todo:", error);
    return res.status(500).json({ error: "error" });
  }
};

const todoUpdate = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    const todo = await db.todos.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const todo1 = await db.todos.findOne({ where: { isDeleted: false } });
    if (!todo1) {
      return res.status(400).json({ error: "Todo is deleted" });
    }
    if (description == "") {
      await db.todos.update(
        { title, description: " " },
        { where: { id: todoId } }
      );
    } else {
      await db.todos.update({ title, description }, { where: { id: todoId } });
    }
    return res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error todo:", error);
    return res.status(500).json({ error: "error" });
  }
};

const todoDeletedAt = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;

    const todo = await db.todos.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const todo1 = await db.todos.findOne({ where: { isDeleted: false } });
    if (!todo1) {
      return res.status(400).json({ error: "Todo already deleted" });
    }
    await db.todos.update(
      { deletedAt: new Date(), isDeleted: true },
      { where: { id: todoId } }
    );
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error todo:", error);
    return res.status(500).json({ error: "error" });
  }
};
module.exports = {
  todoCreate,
  getTodo,
  todoUpdate,
  todoDeletedAt,
  getTodoById
};
