import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { floorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Floors.css';

const Floors = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const response = await floorService.getAllFloors();
      setFloors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch floors');
    } finally {
      setLoading(false);
    }
  };

  const handleFloorClick = (floorId) => {
    navigate(`/classrooms/${floorId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading floors...</div>;
  }

  return (
    <div className="floors-container">
      <div className="floors-header">
        <h1>Select a Floor</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="floors-grid">
        {floors.map((floor) => (
          <div
            key={floor.id}
            className="floor-card"
            onClick={() => handleFloorClick(floor.id)}
          >
            <div className="floor-number">{floor.floor_number}</div>
            <div className="floor-name">{floor.floor_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Floors;
