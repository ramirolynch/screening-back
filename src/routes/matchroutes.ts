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

routes.get("/matchreview/:id", (req, res) => {
  db.manyOrNone("select * from match_reviews where user_id = ${id}", {
    id: req.params.id,
  })
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

routes.post("/nomatch", (req, res) => {
  const nomatch = {
    searched_name: req.body.searched_name,
    user_id: req.body.user_id,
  };
  db.one(
    "INSERT INTO no_match(searched_name, user_id) VALUES(${searched_name}, ${user_id}) returning id",
    nomatch
  )
    .then((id) => {
      return db.oneOrNone("SELECT * FROM no_match WHERE id = ${id}", {
        id: id.id,
      });
    })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).send(error));
});

routes.get("/nomatch/:id", (req, res) => {
  db.manyOrNone(
    "select no_match.searched_name, no_match.screening_ts, no_match.user_id, users.first_name, users.last_name from no_match join users on no_match.user_id = users.id where users.id = ${id}",
    {
      id: req.params.id,
    }
  )
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

export default routes;
