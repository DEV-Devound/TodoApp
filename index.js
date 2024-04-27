const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const app = express()
dotenv.config();

// Models
const TodoTask = require("./models/todoTask");

const uri = process.env.MONGO_URI;
console.log(uri)

//connection to db
mongoose.connect(uri);
console.log("Connected to db!");

app.use("/static", express.static("public"))

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// GET METHOD
app.get("/", async (req, res) => {
    try {
      const tasks = await TodoTask.find({});
      res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });
    
// UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({})
      .then((tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  });



// DELETE
app.route("/remove/:id").get(async (req, res) => {
    try {
      const id = req.params.id;
      await TodoTask.findByIdAndRemove(id);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

app.listen(3000, () => console.log("Server Up and running"));
