// require the express module
import express from "express";
import pg from "pg-promise";
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = pg()({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "casapuerta",
  database: "Screening",
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

routes.post("/matchreview", (req, res) => {
  const matchrev = {
    list_id: req.body.list_id,
    searched_name: req.body.searched_name,
    matched_name: req.body.matched_name,
    score: req.body.score,
    positive_match: req.body.positive_match,
    review_comments: req.body.review_comments,
    user_id: req.body.user_id,
  };

  db.oneOrNone("select * from match_reviews where list_id = ${list_id}", {
    list_id: req.body.list_id,
  }).then((match) => {
    if (match) {
      return res
        .status(400)
        .send("There is a match review with that list_id already.");
    }

    db.one(
      "INSERT INTO match_reviews(list_id, searched_name, matched_name, score, positive_match, review_comments, user_id) VALUES(${list_id}, ${searched_name}, ${matched_name}, ${score}, ${positive_match}, ${review_comments}, ${user_id}) returning id",
      matchrev
    )
      .then((id) => {
        return db.oneOrNone("SELECT * FROM match_reviews WHERE id = ${id}", {
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

routes.get("/users", (req, res) => {
  db.manyOrNone("select * from users")
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
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
