const db = require('./config/database');

db.query("SELECT * FROM timetables WHERE room_type = 'lab' ORDER BY room_id, day_of_week, start_time LIMIT 15")
  .then(res => {
    console.table(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
