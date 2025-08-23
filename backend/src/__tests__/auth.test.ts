import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';

const app: Express = express();
app.use(bodyParser.json());

interface User {
  email: string;
  password: string;
}

const mockUser: User = { email: 'test@example.com', password: 'password123' };

// Explicitly type the handler to avoid TS2769 error
app.post('/login', (req: Request, res: Response): any => {
  const { email, password } = req.body;

  if (email === mockUser.email && password === mockUser.password) {
    return res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Comprehensive Jest tests for POST /login
describe('POST /login', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token', 'fake-jwt-token');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with incorrect email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'wrong@example.com', password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with missing email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with missing password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with empty request body', async () => {
    const res = await request(app)
      .post('/login')
      .send({});
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with invalid email format', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'invalid-email', password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with non-string email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 123, password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with non-string password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 123 });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with whitespace-only email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: '   ', password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail login with whitespace-only password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: '   ' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should handle case-insensitive email (if applicable)', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'TEST@example.com', password: 'password123' });
    expect(res.statusCode).toBe(401); // Assuming case-sensitive comparison
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should handle large input sizes', async () => {
    const largeString = 'a'.repeat(10000); // 10,000 characters
    const res = await request(app)
      .post('/login')
      .send({ email: largeString, password: largeString });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});