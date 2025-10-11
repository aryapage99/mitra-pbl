const queries = require('../queries');

// Get all classrooms
const getAllClassrooms = async (req, res) => {
  try {
    const result = await queries.getAllClassrooms();
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting classrooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get classrooms by floor
const getClassroomsByFloor = async (req, res) => {
  try {
    const { floorId } = req.params;
    const result = await queries.getClassroomsByFloor(floorId);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting classrooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get classroom by ID
const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queries.getClassroomById(id);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting classroom:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllClassrooms,
  getClassroomsByFloor,
  getClassroomById,
};
