const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("common"));
app.use(cors());

const playstoreapps = require("./playstore-data.js");

app.get("/playstoreapps", (req, res) => {
  const { sort, genres } = req.query;

  if (sort) {
    if (!["rating", "app"].includes(sort)) {
      return res
        .status(400)
        .send(`Sort must be "rating" or "app".`);
    }
  }

  if (genres) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          `Genre must be "Action", "Puzzle", "Strategy", "Casual", "Arcade", or "Card".`
        );
    }
  }

  let result = playstoreapps;

  if (genres) {
    result = result
      .filter(playstoreapp =>
        playstoreapp
          .Genres
          .includes(genres)
      );
  }

  if (sort) {
    if (sort === "rating") {
      result
        .sort((a, b) => {
          return b.Rating - a.Rating;
        });
    }

    if (sort === "app") {
      result
        .sort((a, b) => {
          return a.App.toLowerCase() > b.App.toLowerCase() ? 1 : -1;
        });
    }
  }

  res.json(result);
});

module.exports = app;