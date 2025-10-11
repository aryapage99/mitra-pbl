const queries = require('../queries');

// Get all floors
const getAllFloors = async (req, res) => {
  try {
    const result = await queries.getAllFloors();
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting floors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get floor by ID
const getFloorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queries.getFloorById(id);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Floor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting floor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllFloors,
  getFloorById,
};
