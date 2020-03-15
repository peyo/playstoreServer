const app = require("../app");
const expect = require("chai").expect;
const supertest = require("supertest");

describe("Playstore testing", () => {
  it("Should display an array of apps", () => {
    return supertest(app)
      .get("/playstoreapps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array")
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(res.body[0]).to.include.all.keys(
          "App", "Category", "Rating",
          "Reviews", "Size", "Installs",
          "Type", "Price", "Content Rating",
          "Genres", "Last Updated", "Current Ver",
          "Android Ver"
        );
      });
  });

  it("Should sort by Rating", () => {
    return supertest(app)
      .get("/playstoreapps")
      .query({ sort: "rating" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.rating < appAtI.rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it("Should sort by App name", () => {
    return supertest(app)
      .get("/playstoreapps")
      .query({ sort: "app" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");

        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.app < appAtI.app) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it("Should filter by Action genre", () => {
    return supertest(app)
      .get("/playstoreapps")
      .query({ genres: "Action" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");

        let genresArray = [];
        for (i = 0; i < res.body.length; i++) {
          return genresArray.push(res.body.Genres)
        };
        expect(genresArray).to.include.members("Action");
      });
  });

  it("Should filter by Puzzle genre", () => {
    return supertest(app)
      .get("/playstoreapps")
      .query({ genres: "Puzzle" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");

        let genresArray = [];
        for (i = 0; i < res.body.length; i++) {
          return genresArray.push(res.body.Genres)
        };
        expect(genresArray).to.include.members("Puzzle");
      });
  });

  it("Should not include Puzzle genre when filtering by Action", () => {
    return supertest(app)
      .get("/playstoreapps")
      .query({ genres: "Action" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");

        let genresArray = [];
        for (i = 0; i < res.body.length; i++) {
          return genresArray.push(res.body.Genres)
        };
        expect(genresArray).to.not.include("Puzzle");
      });
  });
});