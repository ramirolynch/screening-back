// require the express module
import "dotenv/config";
import express from "express";
import pg from "pg-promise";
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = pg()({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

// create a new Router object
const routes = express.Router();

routes.post("/signup", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, saltRounds);

  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hash,
  };

  db.oneOrNone("select id, email from users where email = ${email}", {
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).send("Email was already registered.");
    }
    db.one(
      "INSERT INTO users(first_name, last_name, email, password) VALUES(${first_name}, ${last_name}, ${email}, ${password}) returning id",
      newUser
    )
      .then((id) => {
        return db.oneOrNone("SELECT * FROM users WHERE id = ${id}", {
          id: id.id,
        });
      })
      .then((data) => res.json(data))
      .catch((error) => res.status(500).send(error));
  });
});

routes.post("/login", (req, res) => {
  db.oneOrNone("select id, email, password from users where email = ${email}", {
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }
    console.log(user);
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send("Invalid email or password.");
    }
    res.json(user);
  });
});

//user by id
routes.get("/users/:id", (req, res) => {
  db.oneOrNone("select * from users WHERE id = ${id}", {
    id: req.params.id,
  })
    .then((user) => res.json(user))
    .catch((error) => console.log(error));
});

export default routes;
