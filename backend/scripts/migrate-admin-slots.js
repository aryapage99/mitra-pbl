const db = require('../config/database');

async function runMigration() {
  try {
    console.log('Starting admin and slots migration...');

    // Update users table to support admin role
    console.log('Updating user role constraints...');
    await db.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
    await db.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'))");

    // Check if slots table exists, if not create it
    console.log('Creating slots table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(50) NOT NULL,
        room_label VARCHAR(100) NOT NULL,
        room_type VARCHAR(50) NOT NULL,
        floor VARCHAR(10) NOT NULL,
        slot_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duration_hours DECIMAL(3,2) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    console.log('Creating indexes...');
    await db.query('CREATE INDEX IF NOT EXISTS idx_slots_room_date ON slots(room_id, slot_date)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_slots_availability ON slots(is_available)');

    // Update/create admin user
    console.log('Setting up admin user...');
    await db.query(`
      INSERT INTO users (email, password, role) VALUES 
      ('admin@college.edu', 'admin123', 'admin')
      ON CONFLICT (email) 
      DO UPDATE SET role = 'admin'
    `);

    // Get admin user ID
    const adminResult = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (adminResult.rows.length === 0) {
      throw new Error('Could not find or create admin user');
    }
    const adminId = adminResult.rows[0].id;

    // Add sample slots
    console.log('Adding sample slots...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await db.query(`
      INSERT INTO slots (room_id, room_label, room_type, floor, slot_date, start_time, end_time, duration_hours, created_by)
      VALUES 
      ('R101', 'Classroom 101', 'classroom', '1', $1, '09:00:00', '10:00:00', 1.00, $2),
      ('R101', 'Classroom 101', 'classroom', '1', $1, '10:00:00', '11:00:00', 1.00, $2),
      ('R102', 'Classroom 102', 'classroom', '1', $1, '11:00:00', '12:00:00', 1.00, $2),
      ('L201', 'Physics Lab', 'lab', '2', $1, '14:00:00', '16:00:00', 2.00, $2),
      ('L202', 'Chemistry Lab', 'lab', '2', $1, '09:00:00', '11:00:00', 2.00, $2)
      ON CONFLICT DO NOTHING
    `, [tomorrowStr, adminId]);

    console.log('Migration completed successfully!');
    console.log('Admin user: admin@college.edu / admin123');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };