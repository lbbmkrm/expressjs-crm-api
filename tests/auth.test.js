import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("auth endpoints", () => {
  const generateUser = () => {
    const timestamp = Date.now();
    return {
      username: `user_${timestamp}`,
      email: `user_${timestamp}@example.com`,
      password: "password123",
    };
  };

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "@example.com",
        },
      },
    });
  });

  it("should register a new user", async () => {
    const newUser = generateUser();
    const response = await request(app)
      .post("/api/auth/register")
      .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.username).toBe(newUser.username);
  });

  it("should fail to register with existing email", async () => {
    const user = generateUser();

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...generateUser(),
        email: user.email,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBeDefined();
  });

  it("should fail to register with existing username", async () => {
    const user = generateUser();

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...generateUser(),
        username: user.username,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBeDefined();
  });

  it("should login with correct credentials", async () => {
    const user = generateUser();

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app).post("/api/auth/login").send({
      emailOrUsername: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("should fail to login with incorrect password", async () => {
    const user = generateUser();

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app).post("/api/auth/login").send({
      emailOrUsername: user.email,
      password: "wrong-password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
  });

  it("should fail to login with invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      emailOrUsername: "non_existent_user",
      password: "invalid",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
  });
});
