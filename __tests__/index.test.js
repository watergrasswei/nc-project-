const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");
const articlesData = require("../db/data/test-data/articles.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("It should respond with an array of topics", async () => {
    const response = await request(app).get("/api/topics");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("slug");
    expect(response.body[0]).toHaveProperty("description");
  });
  test("status:404, handel non-existent routes", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  describe("GET /api", () => {
    test("responds with a JSON object describing all available endpoints", async () => {
      const response = await request(app).get("/api");
      expect(response.statusCode).toBe(200);
      expect(response.body.endpoints).toEqual(endpointsJson);
    });
  });
});

describe("GET /api", () => {
  test("responds with a JSON object describing all available endpoints", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.body.endpoints).toEqual(endpointsJson);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: get an article by its id.", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          votes: 0,
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Invalid article ID format", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID format");
      });
  });
  test("404: Article not found for a valid but non-existing ID", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with all articles.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(articlesData.length);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("should return 404 for an invalid endpoint", () => {
    return request(app).get("/api/invalid_endpoint").expect(404);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("get all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("get all comments for an article", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });

  test("400: Invalid article ID format", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID format");
      });
  });

  test("404: Article not found for a valid but non-existing ID", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a test comment.",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "This is a test comment.",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("400: Invalid article ID format", () => {
    const newComment = {
      username: "validUser",
      body: "This is a test comment.",
    };

    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID format");
      });
  });

  test("400: Missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("404: Article not found", () => {
    const newComment = {
      username: "validUser",
      body: "This is a test comment.",
    };

    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("404: User not found", () => {
    const newComment = {
      username: "invalidUser",
      body: "This is a test comment.",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article", () => {
    const updateData = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(updateData)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 101,
          })
        );
      });
  });

  test("400: Invalid article ID format", () => {
    const updateData = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/invalid_id")
      .send(updateData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID format");
      });
  });

  test("400: Invalid vote increment format", () => {
    const updateData = { inc_votes: "invalid_vote" };

    return request(app)
      .patch("/api/articles/1")
      .send(updateData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid vote increment format");
      });
  });

  test("404: Article not found", () => {
    const updateData = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/9999")
      .send(updateData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Responds with no content', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204);
  });

  test('400: Invalid comment ID format', () => {
    return request(app)
      .delete('/api/comments/invalid_id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment ID format');
      });
  });

  test('404: Comment not found', () => {
    return request(app)
      .delete('/api/comments/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found');
      });
  });
});
