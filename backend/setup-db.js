const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔄 Setting up database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on email
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Insert sample users
    await pool.query(`
      INSERT INTO users (email, password, role) VALUES 
      ('student@college.edu', 'password123', 'student'),
      ('teacher@college.edu', 'password123', 'teacher'),
      ('admin@college.edu', 'admin123', 'teacher')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Sample users created:');
    console.log('   - student@college.edu (password: password123)');
    console.log('   - teacher@college.edu (password: password123)');
    console.log('   - admin@college.edu (password: admin123)');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();