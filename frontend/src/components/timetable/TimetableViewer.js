import React, { useState, useEffect } from "react";
import { COLORS } from "../../styles/colors";
import timetableService from "../../services/timetableService";
import TimetableGrid from "./TimetableGrid";

export function TimetableViewer({ user, onBack }) {
    const [timetables, setTimetables] = useState([]);
    const [filteredTimetables, setFilteredTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [programs, setPrograms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState('all');
    const [selectedDay, setSelectedDay] = useState('all');
    const [selectedRoomType, setSelectedRoomType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // View mode state
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'grid'

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedProgram, selectedRoom, selectedDay, selectedRoomType, searchQuery, timetables]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data
            const [timetablesRes, programsRes, roomsRes] = await Promise.all([
                timetableService.getAllTimetables(),
                timetableService.getPrograms(),
                timetableService.getRooms()
            ]);

            setTimetables(timetablesRes.data || []);
            setPrograms(programsRes.data || []);
            setRooms(roomsRes.data || []);
        } catch (error) {
            console.error('Error fetching timetables:', error);
            setError('Failed to load timetables');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...timetables];

        // Filter by program
        if (selectedProgram !== 'all') {
            filtered = filtered.filter(t => t.program === selectedProgram);
        }

        // Filter by room
        if (selectedRoom !== 'all') {
            filtered = filtered.filter(t => t.room_id === selectedRoom);
        }

        // Filter by day
        if (selectedDay !== 'all') {
            filtered = filtered.filter(t => t.day_of_week === selectedDay);
        }

        // Filter by room type
        if (selectedRoomType !== 'all') {
            filtered = filtered.filter(t => t.room_type === selectedRoomType);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.program?.toLowerCase().includes(query) ||
                t.room_id?.toLowerCase().includes(query)
            );
        }

        setFilteredTimetables(filtered);
    };

    const clearFilters = () => {
        setSelectedProgram('all');
        setSelectedRoom('all');
        setSelectedDay('all');
        setSelectedRoomType('all');
        setSearchQuery('');
    };

    const groupedByDay = timetableService.groupByDay(filteredTimetables);

    return (
        <div style={{
            fontFamily: "'Poppins','Inter',sans-serif",
            background: "#f6f9fb",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 25,
                    flexWrap: "wrap",
                    gap: 15
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <button
                            onClick={onBack}
                            style={{
                                background: COLORS.logoBlue,
                                color: "white",
                                border: "none",
                                borderRadius: 10,
                                padding: "10px 20px",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            ← Back to Map
                        </button>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222", margin: 0 }}>
                            Timetables
                        </h1>
                    </div>
                    <div style={{ fontSize: 14, color: "#71788e" }}>
                        Showing {filteredTimetables.length} of {timetables.length} entries
                    </div>
                </div>

                {/* Filters */}
                <div style={{
                    background: "white",
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 25,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 15
                    }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Filters</h3>
                        <button
                            onClick={clearFilters}
                            style={{
                                background: "none",
                                border: "1px solid #ddd",
                                borderRadius: 6,
                                padding: "6px 12px",
                                fontSize: 13,
                                cursor: "pointer",
                                color: "#71788e"
                            }}
                        >
                            Clear All
                        </button>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 15
                    }}>
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search programs or rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                fontSize: 14,
                                outline: "none"
                            }}
                        />

                        {/* Program Filter */}
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">All Programs</option>
                            {programs.map(program => (
                                <option key={program} value={program}>{program}</option>
                            ))}
                        </select>

                        {/* Room Filter */}
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">All Rooms</option>
                            {rooms.map(room => (
                                <option key={room.room_id} value={room.room_id}>
                                    {room.room_id} ({room.room_type})
                                </option>
                            ))}
                        </select>

                        {/* Day Filter */}
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">All Days</option>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>

                        {/* Room Type Filter */}
                        <select
                            value={selectedRoomType}
                            onChange={(e) => setSelectedRoomType(e.target.value)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">All Types</option>
                            <option value="classroom">Classrooms</option>
                            <option value="lab">Labs</option>
                        </select>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 25,
                    gap: 10
                }}>
                    <button
                        onClick={() => setViewMode('card')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 8,
                            border: viewMode === 'card' ? `2px solid ${COLORS.PRIMARY}` : '1px solid #ddd',
                            background: viewMode === 'card' ? COLORS.PRIMARY : 'white',
                            color: viewMode === 'card' ? 'white' : COLORS.TEXT_PRIMARY,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <span>📋</span> Card View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 8,
                            border: viewMode === 'grid' ? `2px solid ${COLORS.PRIMARY}` : '1px solid #ddd',
                            background: viewMode === 'grid' ? COLORS.PRIMARY : 'white',
                            color: viewMode === 'grid' ? 'white' : COLORS.TEXT_PRIMARY,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <span>📊</span> Grid View
                    </button>
                </div>

                {/* Grid View Guidance */}
                {viewMode === 'grid' && selectedRoom === 'all' && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 20,
                        fontSize: 14,
                        color: '#856404',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <span style={{ fontSize: 20 }}>💡</span>
                        <span><strong>Tip:</strong> Select a specific room from the filter above to see its weekly timetable grid.</span>
                    </div>
                )}

                {/* Content */}
                {loading && (
                    <div style={{
                        textAlign: "center",
                        padding: 60,
                        fontSize: 16,
                        color: "#71788e"
                    }}>
                        Loading timetables...
                    </div>
                )}

                {error && (
                    <div style={{
                        background: "#ffe6e6",
                        color: "#d63384",
                        padding: 20,
                        borderRadius: 12,
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && filteredTimetables.length === 0 && (
                    <div style={{
                        background: "white",
                        borderRadius: 15,
                        padding: 40,
                        textAlign: "center",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                    }}>
                        <div style={{ fontSize: 18, color: "#71788e", marginBottom: 10 }}>
                            No timetable entries found
                        </div>
                        <div style={{ fontSize: 14, color: "#9ba5b8" }}>
                            Try adjusting your filters
                        </div>
                    </div>
                )}

                {!loading && !error && filteredTimetables.length > 0 && (
                    <div>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <TimetableGrid 
                                timetables={filteredTimetables} 
                                selectedRoom={selectedRoom !== 'all' ? selectedRoom : null}
                            />
                        )}

                        {/* Card View */}
                        {viewMode === 'card' && days.map(day => {
                            const dayEntries = groupedByDay[day] || [];
                            if (dayEntries.length === 0) return null;

                            return (
                                <div key={day} style={{ marginBottom: 30 }}>
                                    <h2 style={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: "#222",
                                        marginBottom: 15,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10
                                    }}>
                                        <span style={{
                                            background: COLORS.logoBlue,
                                            color: "white",
                                            padding: "4px 12px",
                                            borderRadius: 6,
                                            fontSize: 16
                                        }}>
                                            {day}
                                        </span>
                                        <span style={{ fontSize: 14, color: "#71788e", fontWeight: 400 }}>
                                            ({dayEntries.length} classes)
                                        </span>
                                    </h2>

                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                                        gap: 15
                                    }}>
                                        {dayEntries.map(entry => (
                                            <TimetableCard key={entry.id} entry={entry} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function TimetableCard({ entry }) {
    const isLab = entry.room_type === 'lab';

    return (
        <div style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: `2px solid ${isLab ? '#f39c12' : COLORS.logoBlue}`,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default"
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        }}
        >
            <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#222",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8
            }}>
                <span style={{
                    background: isLab ? '#f39c12' : COLORS.logoBlue,
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    textTransform: "uppercase"
                }}>
                    {entry.room_id}
                </span>
                <span style={{ fontSize: 11, color: "#9ba5b8", textTransform: "uppercase" }}>
                    {entry.room_type}
                </span>
            </div>

            <div style={{
                fontSize: 15,
                color: "#222",
                fontWeight: 600,
                marginBottom: 12,
                lineHeight: "1.4"
            }}>
                {entry.program}
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#71788e",
                paddingTop: 12,
                borderTop: "1px solid #f0f0f0"
            }}>
                <span>⏰</span>
                <span style={{ fontWeight: 600 }}>
                    {timetableService.formatTimeRange(entry.start_time, entry.end_time)}
                </span>
            </div>

            {entry.capacity && (
                <div style={{
                    fontSize: 12,
                    color: "#9ba5b8",
                    marginTop: 6
                }}>
                    Capacity: {entry.capacity}
                </div>
            )}
        </div>
    );
}
