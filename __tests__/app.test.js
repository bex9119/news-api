const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api - controller set up correctly", () => {
  test("200: return an object which describes all available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const responseEndpoints = body.endpoints;
        expect(responseEndpoints).toEqual(endpoints);
      });
  });
  test("404: when invalid path given, returns error", () => {
    return request(app)
      .get("/api/notavalidpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: return all topics from table, respond with an array of objects, each with a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: return articles by their id's", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveLength(1);
        expect(typeof article[0].author).toBe("string");
        expect(typeof article[0].title).toBe("string");
        expect(typeof article[0].article_id).toBe("number");
        expect(typeof article[0].body).toBe("string");
        expect(typeof article[0].topic).toBe("string");
        expect(typeof article[0].created_at).toBe("string");
        expect(typeof article[0].votes).toBe("number");
        expect(typeof article[0].article_img_url).toBe("string");
      });
  });
  test("404: return Not Found when given a valid article_id which does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: return Bad Request when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
