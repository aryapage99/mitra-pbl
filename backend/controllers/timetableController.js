const Timetable = require('../models/Timetable');

// Get all timetables with optional filters
const getAllTimetables = async (req, res) => {
  try {
    const filters = {
      roomId: req.query.roomId,
      roomType: req.query.roomType,
      dayOfWeek: req.query.dayOfWeek,
      program: req.query.program
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const timetables = await Timetable.getAll(filters);

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetables',
      error: error.message
    });
  }
};

// Get timetables for a specific room
const getRoomTimetable = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { day } = req.query;

    let timetables;
    if (day) {
      timetables = await Timetable.getByRoomAndDay(roomId, day);
    } else {
      timetables = await Timetable.getByRoom(roomId);
    }

    res.status(200).json({
      success: true,
      roomId,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    console.error('Error fetching room timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room timetable',
      error: error.message
    });
  }
};

// Get timetables for a specific program
const getProgramTimetable = async (req, res) => {
  try {
    const { program } = req.params;
    const timetables = await Timetable.getByProgram(program);

    res.status(200).json({
      success: true,
      program,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    console.error('Error fetching program timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching program timetable',
      error: error.message
    });
  }
};

// Get timetables for a specific day
const getDayTimetable = async (req, res) => {
  try {
    const { day } = req.params;
    const timetables = await Timetable.getByDay(day);

    res.status(200).json({
      success: true,
      day,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    console.error('Error fetching day timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching day timetable',
      error: error.message
    });
  }
};

// Get list of all programs
const getPrograms = async (req, res) => {
  try {
    const programs = await Timetable.getPrograms();

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching programs',
      error: error.message
    });
  }
};

// Get list of all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Timetable.getRooms();

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Get timetable statistics
const getStats = async (req, res) => {
  try {
    const stats = await Timetable.getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllTimetables,
  getRoomTimetable,
  getProgramTimetable,
  getDayTimetable,
  getPrograms,
  getRooms,
  getStats
};
