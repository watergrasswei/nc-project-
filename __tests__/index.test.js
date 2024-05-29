const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());


describe('GET /api/topics', () => {
    test('It should respond with an array of topics', async () => {
        const response = await request(app).get('/api/topics');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('slug');
        expect(response.body[0]).toHaveProperty('description');
    });
      test('status:404, handel non-existent routes', () => {
        return request(app)
          .get('/api/nonexistent')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('not found');
          });
      });











});
