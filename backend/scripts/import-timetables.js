const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/database');

// Utility functions
function cleanRoomName(roomStr) {
  if (!roomStr) return null;
  // Extract room number and remove extra text
  // "VY 401 (Class)" -> "VY401"
  // "VY426 (LAB)" -> "VY426"
  const match = roomStr.match(/VY\s*\d+/i);
  return match ? match[0].replace(/\s+/g, '') : roomStr.trim();
}

function parseTimeSlot(timeStr) {
  if (!timeStr) return null;
  
  // Handle formats like "8.30-10.30", "1.30-5.30", "9.00-1.00"
  const match = timeStr.match(/(\d+)\.(\d+)-(\d+)\.(\d+)/);
  if (!match) return null;
  
  let [, startHour, startMin, endHour, endMin] = match;
  
  // Convert to integers
  startHour = parseInt(startHour);
  startMin = parseInt(startMin);
  endHour = parseInt(endHour);
  endMin = parseInt(endMin);
  
  // Handle afternoon times (1.30 = 13:30)
  if (startHour < 8) startHour += 12;
  if (endHour < 8 || (endHour < startHour && endHour !== 1)) endHour += 12;
  
  // Format as HH:MM:SS
  const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
  
  return { startTime, endTime };
}

function determineRoomType(roomStr) {
  if (!roomStr) return 'classroom';
  return roomStr.toLowerCase().includes('lab') ? 'lab' : 'classroom';
}

function extractCapacity(roomStr, capacityCol) {
  // Try to extract from room string or capacity column
  if (capacityCol && !isNaN(parseInt(capacityCol))) {
    return parseInt(capacityCol);
  }
  
  const match = roomStr?.match(/\((\d+)\)/);
  return match ? parseInt(match[1]) : null;
}

async function importCSV(filePath, roomType) {
  return new Promise((resolve, reject) => {
    const results = [];
    let currentRoom = null;
    let currentCapacity = null;
    let rowCount = 0;
    let headerProcessed = false;
    
    fs.createReadStream(filePath)
      .pipe(csv({ skipLines: 5 })) // Skip first 5 header rows
      .on('data', (row) => {
        rowCount++;
        
        // Get all column keys to debug
        const keys = Object.keys(row);
        
        // Try to find the room column (might have different names)
        let roomCol = null;
        for (const key of keys) {
          if (key.toLowerCase().includes('room') || key.toLowerCase().includes('sr.no')) {
            roomCol = row[key];
            break;
          }
        }
        
        // Try to find Sr.No column (first column)
        const srNoCol = row['Sr.No'] || row['Sr. No'] || keys[0] ? row[keys[0]] : null;
        
        // Check if this row has a Sr.No (indicates new room)
        if (srNoCol && !isNaN(parseInt(srNoCol))) {
          // This is a new room row
          roomCol = row[keys[1]] || roomCol; // Room is usually second column
          if (roomCol && roomCol.trim()) {
            const cleanedRoom = cleanRoomName(roomCol);
            if (cleanedRoom && cleanedRoom.match(/VY\d+/i)) {
              currentRoom = cleanedRoom;
              currentCapacity = extractCapacity(roomCol, null);
            }
          }
        }
        
        // Skip if no current room
        if (!currentRoom) return;
        
        // Get time slot (third column typically)
        let timeCol = row['Time'];
        if (!timeCol) {
          // Try to find time column by position
          timeCol = row[keys[2]];
        }
        if (!timeCol || !timeCol.trim()) return;
        
        const times = parseTimeSlot(timeCol);
        if (!times) return;
        
        // Process each day - find columns for Mon, Tue, Wed, Thu, Fri
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const dayKeys = keys.filter(k => 
          k === 'Mon' || k === 'Tue' || k === 'Wed' || k === 'Thu' || k === 'Fri'
        );
        
        dayKeys.forEach((dayKey) => {
          const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(dayKey);
          const program = row[dayKey];
          
          if (program && program.trim() && program.trim() !== '') {
            results.push({
              roomId: currentRoom,
              roomType: roomType,
              capacity: currentCapacity,
              dayOfWeek: dayNames[dayIndex],
              startTime: times.startTime,
              endTime: times.endTime,
              program: program.trim(),
              notes: null
            });
          }
        });
      })
      .on('end', () => {
        console.log(`Parsed ${results.length} timetable entries from ${filePath}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

async function insertTimetables(entries) {
  let successCount = 0;
  let errorCount = 0;
  
  for (const entry of entries) {
    try {
      await db.query(
        `INSERT INTO timetables 
        (room_id, room_type, capacity, day_of_week, start_time, end_time, program, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          entry.roomId,
          entry.roomType,
          entry.capacity,
          entry.dayOfWeek,
          entry.startTime,
          entry.endTime,
          entry.program,
          entry.notes
        ]
      );
      successCount++;
    } catch (error) {
      console.error(`Error inserting: ${entry.roomId} ${entry.dayOfWeek} ${entry.startTime}`, error.message);
      errorCount++;
    }
  }
  
  return { successCount, errorCount };
}

async function main() {
  try {
    console.log('Starting timetable import...\n');
    
    // Clear existing timetables
    console.log('Clearing existing timetables...');
    await db.query('DELETE FROM timetables');
    console.log('✓ Cleared existing data\n');
    
    // Import classroom allocations
    console.log('Importing classroom allocations...');
    const classroomFile = './allocation/Copy of  ALLOCATION - 3 July  2025-26 ODD SEM - Copy of CLASSROOM ALLOCATION.csv';
    const classroomEntries = await importCSV(classroomFile, 'classroom');
    const classroomResults = await insertTimetables(classroomEntries);
    console.log(`✓ Classrooms: ${classroomResults.successCount} inserted, ${classroomResults.errorCount} errors\n`);
    
    // Import lab allocations
    console.log('Importing lab allocations...');
    const labFile = './allocation/Copy of  ALLOCATION - 3 July  2025-26 ODD SEM - LAB ALLOCATION.csv';
    const labEntries = await importCSV(labFile, 'lab');
    const labResults = await insertTimetables(labEntries);
    console.log(`✓ Labs: ${labResults.successCount} inserted, ${labResults.errorCount} errors\n`);
    
    // Summary
    const totalSuccess = classroomResults.successCount + labResults.successCount;
    const totalErrors = classroomResults.errorCount + labResults.errorCount;
    
    console.log('='.repeat(50));
    console.log('Import Complete!');
    console.log(`Total entries imported: ${totalSuccess}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log('='.repeat(50));
    
    // Show some sample data
    const sample = await db.query('SELECT * FROM timetables LIMIT 5');
    console.log('\nSample data:');
    console.table(sample.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importCSV, insertTimetables };
