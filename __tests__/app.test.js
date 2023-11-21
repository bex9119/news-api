const request = require('supertest')
const seed = require('../db/seeds/seed')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')

beforeAll(() => seed(data))
afterAll(() => db.end())

describe('GET /api - controller set up correctly', () => {
    test('200: return an object which describes all available endpoints on the API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const responseEndpoints = body.endpoints
            expect(responseEndpoints).toEqual(endpoints)
        })
    });
    test('404: when invalid path given, returns error', () => {
        return request(app)
        .get('/api/notavalidpath')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
});

describe('GET /api/topics', () => {
    test('200: return all topics from table, respond with an array of objects, each with a slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    });
});

describe.skip('GET /api/articles', () => {
    test('200: return array of article objects with a comment count, sorted by created_at in desc order, without body property ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            //Set up sorted by
            expect(body.articles).toBeSorted(body.articles.created_at, {descending: true})
            body.articles.forEach((article) => {
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