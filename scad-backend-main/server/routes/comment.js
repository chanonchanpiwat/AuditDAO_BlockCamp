const express = require("express");

// commentRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const commentRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

//add comment
commentRoutes.route("/comment").post(async (req, res) => {
  const dbConnect = dbo.getDb();
  const commentDocument = {
    quest_id: req.body.quest_id,
    comment: req.body.comment,
    user_addr: req.body.user_addr,
    sub_comment: [],
  };
  dbConnect.collection("comments").insertOne(commentDocument, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting matches!");
    } else {
      console.log(`Added a new comment ${result.insertedId}`);
      res.status(204).send();
    }
  });
});

//list of all the comment by quest_id.
commentRoutes.route("/comments/:quest_id").get(async (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("comments")
    .find({ quest_id: req.params.quest_id })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

commentRoutes.route("/comment/:comment_id").get(async (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("comments")
    .find({ _id: req.params.comment_id })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

//add sub comment
commentRoutes.route("/subcomment").post(async (req, res) => {
  const dbConnect = dbo.getDb();
  const subCommentDocument = {
    sub_comment: req.body.sub_comment,
    user_addr: req.body.user_addr,
  };
  console.log(subCommentDocument, req.body.quest_id);
  dbConnect
    .collection("comments")
    .updateOne(
      { quest_id: req.body.quest_id },
      { $push: { sub_comment: subCommentDocument } },
      (err, result) => {
        if (err) {
          res.status(400).send("Error inserting matches!");
        } else {
          console.log(`Added a new sub comment ${result.ok}`);
          res.status(204).send();
        }
      }
    );
});

module.exports = commentRoutes;
