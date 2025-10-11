import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classroomService, floorService } from '../services/api';
import './Classrooms.css';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { floorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [floorId]);

  const fetchData = async () => {
    try {
      const [classroomsResponse, floorResponse] = await Promise.all([
        classroomService.getClassroomsByFloor(floorId),
        floorService.getFloorById(floorId),
      ]);
      setClassrooms(classroomsResponse.data);
      setFloor(floorResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/floors');
  };

  if (loading) {
    return <div className="loading">Loading classrooms...</div>;
  }

  return (
    <div className="classrooms-container">
      <div className="classrooms-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Floors
        </button>
        <h1>
          {floor?.floor_name || `Floor ${floor?.floor_number}`} - Classrooms
        </h1>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="classrooms-grid">
        {classrooms.length === 0 ? (
          <div className="no-classrooms">No classrooms found on this floor</div>
        ) : (
          classrooms.map((classroom) => (
            <div key={classroom.id} className="classroom-card">
              <div className="classroom-number">{classroom.room_number}</div>
              <div className="classroom-info">
                <p>
                  <strong>Capacity:</strong> {classroom.capacity || 'N/A'} students
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Classrooms;
