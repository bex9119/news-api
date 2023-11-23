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
        expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 3,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
        })
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

describe('GET /api/articles', () => {
    test('200: return array of article objects with a comment count, sorted by created_at in desc order, without body property ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true})
            body.articles.forEach((article) => {
                expect(article).toEqual({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
                })
            })
        })
    });

});

describe('GET /api/articles/:article_id/comments', () => {
    test('200: return array of comments for the valid article_id', () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body }) => {
            const {comments} = body
            expect(comments).toHaveLength(2)
            expect(comments).toBeSortedBy("created_at", {
                descending: true})
            comments.forEach((comment) => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 3               
            })
            })
        })
    });
    test("404: return Not Found when given a valid article_id which does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      test("400: return Bad Request when given an invalid article_id", () => {
        return request(app)
          .get("/api/articles/not-an-id/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("200: return an empty array when given a existing article which has no comments associated with it", () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([])
        })
      })
});







describe('PATCH /api/articles/:article_id', () => {
    test('update an article by article_id, return updated article', () => {
        const patchArticle = { inc_votes : 1 }
        return request(app)
        .patch('/api/articles/3')
        .send(patchArticle)
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 1,
                article_img_url: expect.any(String)
            })
          }); 
    });
    test('400: return Bad Request when inc_votes is not a number', () => {
        const patchArticle = { inc_votes : 'not a number' }
        return request(app)
        .patch('/api/articles/3')
        .send(patchArticle)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
    });
    test('400: return Bad Request when attempting to add anything other than inc_votes', () => {
        const patchArticle = { not_a_key : '10' }
        return request(app)
        .patch('/api/articles/3')
        .send(patchArticle)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
    });
    test("200: return articles by their id's, check that vote change has not been applied to other articles (only to id=3)", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 5,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 0,
                article_img_url: expect.any(String)
            })
          });  
        });
        test("404: return Not Found when given a valid article_id which does not exist", () => {
            const patchArticle = { inc_votes : 1 }
            return request(app)
            .patch('/api/articles/999')
            .send(patchArticle)
              .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
              });
          });
          test("400: return Bad Request when given an invalid article_id", () => {
            const patchArticle = { inc_votes : 1 }
            return request(app)
            .patch('/api/articles/not-an-id')
            .send(patchArticle)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
            });
});

