import connectDB from '../config/db.js';
import bcrypt from 'bcryptjs';

export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.subscription_plan = data.subscription_plan || 'free';
    this.subscription_expires_at = data.subscription_expires_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(userData) {
    const pool = await connectDB();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const query = `
      INSERT INTO users (name, email, password, role, subscription_plan, subscription_expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      userData.name,
      userData.email,
      hashedPassword,
      userData.role || 'user',
      userData.subscription_plan || 'free',
      userData.subscription_expires_at
    ];
    
    const result = await pool.query(query, values);
    return new User(result.rows[0]);
  }

  static async findByEmail(email) {
    const pool = await connectDB();
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async findById(id) {
    const pool = await connectDB();
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async count() {
    const pool = await connectDB();
    const query = 'SELECT COUNT(*) FROM users';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  static async findAll() {
    const pool = await connectDB();
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new User(row));
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      subscription: {
        plan: this.subscription_plan,
        expiresAt: this.subscription_expires_at
      },
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}