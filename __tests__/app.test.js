const request = require('supertest')
const seed = require('../db/seeds/seed')
const app = require('../app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')

beforeAll(() => seed(data))
afterAll(() => db.end())

describe('GET /api - controller set up correctly', () => {
    test('200: return an object which describes all available endpoints on the API', () => {
        return request(app)
        .get('/api/')
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body
            const possibleEndpoints = Object.keys(endpoints)
            possibleEndpoints.forEach((endpoint) => {
                const keys = Object.keys(endpoints[endpoint])
                expect(typeof endpoints[endpoint].description).toBe('string')
                if (keys.includes('queries')){
                expect(Array.isArray(endpoints[endpoint].queries)).toBe(true)
                }
                if(keys.includes('exampleResponse')) {
                    expect(Array.isArray(endpoints[endpoint].exampleResponse)).toBe(false)
                    expect(endpoints[endpoint].exampleResponse).toBeInstanceOf(Object)
                }
            })
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