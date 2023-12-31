const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
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
            article_img_url: expect.any(String),
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
              expect(article).not.toHaveProperty('body')
                expect(article).toMatchObject({
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

describe('POST /api/articles/:article_id/comments', () => {
        const commentToPost = {
            username: 'rogersop',
            body: 'uh-oh'}    
    test('should add a comment for a specific article, return the posted comment', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send(commentToPost)
        .expect(201)
        .then(({ body }) => {
            const {postedComment} = body
            expect(postedComment).toMatchObject({
                    comment_id: 19,
                    body: 'uh-oh',
                    article_id: 3,
                    author: 'rogersop',
                    votes: 0,
                    created_at: expect.any(String)
                  })
        })
    });
    test('should add a comment for a specific article, return the posted comment, will ignore unnecessary properties on the request', () => {
        return request(app)
        .post('/api/articles/5/comments')
        .send({
            username: 'rogersop',
            body: 'ignore me please',
            votes: 100000,
            comment_id: 50} )
        .expect(201)
        .then(({ body }) => {
            const {postedComment} = body
            expect(postedComment).toMatchObject({
                    comment_id: 19,
                    body: 'ignore me please',
                    article_id: 5,
                    author: 'rogersop',
                    votes: 0,
                    created_at: expect.any(String)
                  })
        })
    });
    test("404: return Not Found when posting to a valid article_id which does not exist", () => {
        return request(app)
          .post("/api/articles/999/comments")
          .send(commentToPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
      test("400: return Bad Request when posting to an invalid article_id", () => {
        return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(commentToPost)
        .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("400: return Bad Request when posting without a required key (no body)", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({username: 'rogersop'})
        .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("404: return Not Found when posting without a valid author", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username: 'not_a_username',
            body: 'uh-oh'} )
        .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });

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
            expect(article).toMatchObject({
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

describe('DELETE /api/comments/:comment_id', () => {
    test('204: delete a comment by comment_id, response has no content ', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    });
    test('400: return Bad Request when passed an invalid comment_id', () => {
        return request(app)
        .delete('/api/comments/not-a-valid-id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        })
    });
    test('404: return Not Found when passed an valid comment_id which does not exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
        })
    });
});
describe('GET /api/users', () => {
    test('200: return all users from table, respond with an array of objects, each with a username, name and avatar_url",', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            const { users } = body
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    });
});

describe('GET /api/articles (topic query)', () => {
    test('200: return articles filtered by topic using a query', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(12)
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true})
            body.articles.forEach((article) => {
                expect(article).not.toHaveProperty('body')
                expect(article).toMatchObject({
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
    test('404: return Not Found when passed an invalid topic', () => {
        return request(app)
        .get('/api/articles?topic=not_valid')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });  
    });
    test('200: return empty array when passed a valid topic with no articles associated with the query', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toEqual([]);
          });  
    });
});

describe('GET /api/articles/:article_id (comment_count)', () => {
    test('200: return article by article_id which now includes a count of comments', () => {
      return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('comment_count')
      })
    });
});

describe('GET /api/articles (sorting queries)', () => {
    test('200: return articles when  sorted by a valid column (author) and in ascending order', () => {
      return request(app)
      .get('/api/articles?sort_by=comment_count&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('comment_count')
      }) 
    });
    test('400: return Bad Request when passed an invalid sort_by query', () => {
      return request(app)
      .get('/api/articles?sort_by=not_valid&order=DESC')
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });  
  });
  test('400: return Bad Request when passed an invalid order query', () => {
      return request(app)
      .get('/api/articles?sort_by=created_at&order=invalid_order')
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });  
  });
});

describe('Express Router', () => {
    test('return ok message if api router set up correctly', () => {
      return request(app)
      .get('/')
      .expect(200)
      .then(({ body }) =>  {
        expect(body.msg).toBe('API Router OK')
      })
    });
});

describe('GET /api/users/:username', () => {
  test('200: return selected user by username, respond with an array of objects, each with a username, name and avatar_url', () => {
    return request(app)
    .get('/api/users/lurker')
    .expect(200)
    .then(({ body }) => {
        const { user } = body
            expect(user).toMatchObject({
                username: 'lurker',
                name: expect.any(String),
                avatar_url: expect.any(String)
            })
    })

});
test("404: return Not Found when given a username which does not exist", () => {
  return request(app)
    .get("/api/users/999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
});
});

describe('PATCH /api/comments/:comment', () => {
  test('update a comment by comment_id, return updated comment, increase votes', () => {
      const patchComment = { inc_votes : 1 }
      return request(app)
      .patch('/api/comments/1')
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        const {updatedComment} = body
        expect(updatedComment).toMatchObject({
                comment_id: 1,
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: 17,
                created_at: expect.any(String)
              })
    })
  })

  test('400: return Bad Request when inc_votes is not a number', () => {
      const patchComment = { inc_votes : 'not a number' }
      return request(app)
      .patch('/api/comments/3')
      .send(patchComment)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      });
  });
  test('400: return Bad Request when attempting to add anything other than inc_votes', () => {
      const patchComment = { not_a_key : '10' }
      return request(app)
      .patch('/api/comments/3')
      .send(patchComment)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: return Not Found when given a valid article_id which does not exist", () => {
      const patchComment = { inc_votes : 1 }
      return request(app)
      .patch('/api/comments/999')
      .send(patchComment)
      .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
      });
  });
  test("400: return Bad Request when given an invalid comment_id", () => {
      const patchComment = { inc_votes : 1 }
      return request(app)
      .patch('/api/comments/not-an-id')
      .send(patchComment)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
      });
  });
});