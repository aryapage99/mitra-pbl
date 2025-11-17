import React, { useState, useEffect, useMemo } from "react";
import { COLORS } from "../../styles/colors";
import adminService from "../../services/adminService";
import { ROOM_DATA } from "../../data/roomData";

export function AdminDashboard({ user, onBack }) {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('slots');
    const [newSlot, setNewSlot] = useState({
        roomId: '',
        roomLabel: '',
        roomType: 'classroom',
        floor: '',
        slotDate: '',
        startTime: '',
        endTime: ''
    });
    const [creatingSlot, setCreatingSlot] = useState(false);

    // Floors and rooms derived from ROOM_DATA to ensure IDs match teacher view
    const availableFloors = useMemo(() => Object.keys(ROOM_DATA), []);
    const availableRooms = useMemo(() => {
        const floorKey = parseInt(newSlot.floor, 10);
        const floorBlocks = ROOM_DATA[floorKey] || {};
        const allRooms = Object.values(floorBlocks).flat();
        return allRooms.filter(r => r.type === newSlot.roomType);
    }, [newSlot.floor, newSlot.roomType]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getDashboard();
            setDashboard(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        
        if (!newSlot.roomId || !newSlot.roomLabel || !newSlot.floor || 
            !newSlot.slotDate || !newSlot.startTime || !newSlot.endTime) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setCreatingSlot(true);
            await adminService.createSlot(newSlot);
            setNewSlot({
                roomId: '',
                roomLabel: '',
                roomType: 'classroom',
                floor: '',
                slotDate: '',
                startTime: '',
                endTime: ''
            });
            await fetchDashboard(); // Refresh dashboard
            alert('Slot created successfully!');
        } catch (error) {
            console.error('Error creating slot:', error);
            alert(error.message || 'Failed to create slot');
        } finally {
            setCreatingSlot(false);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        try {
            await adminService.deleteBooking(bookingId);
            await fetchDashboard(); // Refresh dashboard
            alert('Booking deleted successfully');
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert(error.message || 'Failed to delete booking');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('Are you sure you want to delete this slot? This action cannot be undone.')) {
            return;
        }

        try {
            await adminService.deleteSlot(slotId);
            await fetchDashboard(); // Refresh dashboard
            alert('Slot deleted successfully');
        } catch (error) {
            console.error('Error deleting slot:', error);
            alert(error.message || 'Failed to delete slot');
        }
    };

    const handleToggleSlotAvailability = async (slotId, currentAvailability) => {
        try {
            await adminService.updateSlotAvailability(slotId, !currentAvailability);
            await fetchDashboard(); // Refresh dashboard
        } catch (error) {
            console.error('Error updating slot availability:', error);
            alert(error.message || 'Failed to update slot availability');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getTimeSlotOptions = () => {
        const options = [];
        // Generate time slots from 8 AM to 5 PM in 1-hour blocks
        for (let hour = 8; hour < 17; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
            const startDisplay = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
            const endDisplay = (hour + 1) < 12 ? `${hour + 1}:00 AM` : (hour + 1) === 12 ? '12:00 PM' : `${(hour + 1) - 12}:00 PM`;
            
            options.push({
                value: `${startTime}-${endTime}`,
                label: `${startDisplay} - ${endDisplay}`
            });
        }
        return options;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button onClick={onBack} style={styles.backButton}>
                        ← Back
                    </button>
                    <h2 style={styles.title}>Admin Dashboard</h2>
                </div>
                <div style={styles.loading}>Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button onClick={onBack} style={styles.backButton}>
                        ← Back
                    </button>
                    <h2 style={styles.title}>Admin Dashboard</h2>
                </div>
                <div style={styles.error}>{error}</div>
                <button onClick={fetchDashboard} style={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={onBack} style={styles.backButton}>
                    ← Back
                </button>
                <div style={styles.titleSection}>
                    <h2 style={styles.title}>🎛️ Admin Dashboard</h2>
                    <p style={styles.subtitle}>Manage slots and monitor bookings</p>
                </div>
                <div style={styles.userInfo}>
                    <span style={styles.adminBadge}>ADMIN</span>
                    <span style={styles.userEmail}>{user.email}</span>
                </div>
            </div>

            {/* Summary Stats */}
            <div style={styles.summaryContainer}>
                <div style={styles.summaryCard}>
                    <div style={styles.cardIcon}>📅</div>
                    <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>Total Bookings</h3>
                        <div style={styles.summaryNumber}>{dashboard.summary.totalBookings}</div>
                        <span style={styles.cardSubtext}>Active reservations</span>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.cardIcon}>⏰</div>
                    <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>Total Slots</h3>
                        <div style={styles.summaryNumber}>{dashboard.summary.totalSlots}</div>
                        <span style={styles.cardSubtext}>Created time slots</span>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.cardIcon}>✅</div>
                    <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>Available Slots</h3>
                        <div style={styles.summaryNumber}>{dashboard.summary.availableSlots}</div>
                        <span style={styles.cardSubtext}>Ready for booking</span>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.cardIcon}>🏫</div>
                    <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>Total Rooms</h3>
                        <div style={styles.summaryNumber}>{dashboard.summary.totalRooms}</div>
                        <span style={styles.cardSubtext}>Managed spaces</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabContainer}>
                <button 
                    onClick={() => setActiveTab('slots')}
                    style={activeTab === 'slots' ? styles.activeTab : styles.tab}
                >
                    📊 Available Slots
                </button>
                <button 
                    onClick={() => setActiveTab('create')}
                    style={activeTab === 'create' ? styles.activeTab : styles.tab}
                >
                    ➕ Create Slot
                </button>
                <button 
                    onClick={() => setActiveTab('bookings')}
                    style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
                >
                    📋 Manage Bookings
                </button>
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
                {activeTab === 'slots' && (
                    <div>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>📍 Available Slots by Room</h3>
                            <div style={styles.filterControls}>
                                <span style={styles.filterLabel}>Quick View</span>
                            </div>
                        </div>
                        {Object.keys(dashboard.slotsByRoom).length === 0 ? (
                            <div style={styles.emptyStateCard}>
                                <div style={styles.emptyIcon}>📅</div>
                                <h4>No slots created yet</h4>
                                <p>Create your first time slot to get started</p>
                                <button 
                                    onClick={() => setActiveTab('create')}
                                    style={styles.createFirstSlotButton}
                                >
                                    Create First Slot
                                </button>
                            </div>
                        ) : (
                            Object.entries(dashboard.slotsByRoom).map(([roomId, roomData]) => (
                                <div key={roomId} style={styles.modernRoomCard}>
                                    <div style={styles.modernRoomHeader}>
                                        <div style={styles.roomIconSection}>
                                            <span style={styles.roomIcon}>
                                                {roomData.roomInfo.type === 'lab' ? '🧪' : '📚'}
                                            </span>
                                            <div>
                                                <h4 style={styles.roomTitle}>{roomData.roomInfo.label}</h4>
                                                <span style={styles.roomMeta}>
                                                    {roomData.roomInfo.type} • Floor {roomData.roomInfo.floor}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={styles.slotCount}>
                                            <span style={styles.slotCountNumber}>{roomData.slots.length}</span>
                                            <span style={styles.slotCountLabel}>slots</span>
                                        </div>
                                    </div>
                                    <div style={styles.modernSlotsList}>
                                        {roomData.slots.map(slot => (
                                            <div key={slot.id} style={{
                                                ...styles.modernSlotItem,
                                                borderLeft: `4px solid ${slot.isAvailable ? '#10B981' : '#EF4444'}`
                                            }}>
                                                <div style={styles.slotMainInfo}>
                                                    <div style={styles.slotTimeInfo}>
                                                        <span style={styles.slotDate}>{formatDate(slot.date)}</span>
                                                        <span style={styles.slotTime}>
                                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                        </span>
                                                        <span style={styles.slotDuration}>{slot.duration}h</span>
                                                    </div>
                                                    <div style={{
                                                        ...styles.slotStatus,
                                                        backgroundColor: slot.isAvailable ? '#ECFDF5' : '#FEF2F2',
                                                        color: slot.isAvailable ? '#065F46' : '#991B1B'
                                                    }}>
                                                        {slot.isAvailable ? '✅ Available' : '❌ Unavailable'}
                                                    </div>
                                                </div>
                                                <div style={styles.slotActions}>
                                                    <button
                                                        onClick={() => handleToggleSlotAvailability(slot.id, slot.isAvailable)}
                                                        style={{
                                                            ...styles.modernToggleButton,
                                                            backgroundColor: slot.isAvailable ? '#F59E0B' : '#10B981',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {slot.isAvailable ? '🚫 Disable' : '✅ Enable'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                        style={styles.modernDeleteButton}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>📋 All Bookings Management</h3>
                            <div style={styles.filterControls}>
                                <span style={styles.filterLabel}>Admin Override Zone</span>
                            </div>
                        </div>
                        {Object.keys(dashboard.bookingsByRoom).length === 0 ? (
                            <div style={styles.emptyStateCard}>
                                <div style={styles.emptyIcon}>📅</div>
                                <h4>No active bookings</h4>
                                <p>Teachers haven't made any bookings yet</p>
                            </div>
                        ) : (
                            Object.entries(dashboard.bookingsByRoom).map(([roomId, roomData]) => (
                                <div key={roomId} style={styles.modernRoomCard}>
                                    <div style={styles.modernRoomHeader}>
                                        <div style={styles.roomIconSection}>
                                            <span style={styles.roomIcon}>
                                                {roomData.roomInfo.type === 'lab' ? '🧪' : '📚'}
                                            </span>
                                            <div>
                                                <h4 style={styles.roomTitle}>{roomData.roomInfo.label}</h4>
                                                <span style={styles.roomMeta}>
                                                    {roomData.roomInfo.type} • Floor {roomData.roomInfo.floor}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={styles.slotCount}>
                                            <span style={styles.slotCountNumber}>{roomData.bookings.length}</span>
                                            <span style={styles.slotCountLabel}>bookings</span>
                                        </div>
                                    </div>
                                    <div style={styles.modernSlotsList}>
                                        {roomData.bookings.map(booking => (
                                            <div key={booking.id} style={styles.modernBookingItem}>
                                                <div style={styles.bookingMainInfo}>
                                                    <div style={styles.teacherInfo}>
                                                        <span style={styles.teacherIcon}>👨‍🏫</span>
                                                        <div>
                                                            <span style={styles.teacherEmail}>{booking.teacherEmail}</span>
                                                            <span style={styles.bookingTime}>
                                                                {formatDate(booking.date)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div style={styles.bookingDuration}>
                                                        {booking.duration}h
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBooking(booking.id)}
                                                    style={styles.modernDeleteButton}
                                                    title="Cancel this booking"
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Remove old slots tab content since it's now the default */}
                {activeTab === 'oldslots' && (
                    <div>
                        <h3 style={styles.sectionTitle}>Available Slots by Room</h3>
                        {Object.keys(dashboard.slotsByRoom).length === 0 ? (
                            <div style={styles.emptyState}>No slots found</div>
                        ) : (
                            Object.entries(dashboard.slotsByRoom).map(([roomId, roomData]) => (
                                <div key={roomId} style={styles.roomCard}>
                                    <div style={styles.roomHeader}>
                                        <h4>{roomData.roomInfo.label}</h4>
                                        <span style={styles.roomType}>
                                            {roomData.roomInfo.type} • Floor {roomData.roomInfo.floor}
                                        </span>
                                    </div>
                                    <div style={styles.slotsList}>
                                        {roomData.slots.map(slot => (
                                            <div key={slot.id} style={styles.slotItem}>
                                                <div style={styles.slotInfo}>
                                                    <span>{formatDate(slot.date)}</span>
                                                    <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                                    <span>{slot.duration}h</span>
                                                    <span style={{
                                                        ...styles.slotStatus,
                                                        color: slot.isAvailable ? COLORS.success : COLORS.error
                                                    }}>
                                                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                                                    </span>
                                                    <small>Created by: {slot.createdBy}</small>
                                                </div>
                                                <div style={styles.slotActions}>
                                                    <button
                                                        onClick={() => handleToggleSlotAvailability(slot.id, slot.isAvailable)}
                                                        style={{
                                                            ...styles.toggleButton,
                                                            backgroundColor: slot.isAvailable ? COLORS.warning : COLORS.success
                                                        }}
                                                    >
                                                        {slot.isAvailable ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                        style={styles.deleteButton}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'create' && (
                    <div>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>⚡ Create New Time Slot</h3>
                            <div style={styles.filterControls}>
                                <span style={styles.filterLabel}>Quick Setup</span>
                            </div>
                        </div>
                        <form onSubmit={handleCreateSlot} style={styles.form}>
                            <div style={styles.formSection}>
                                <h4 style={styles.formSectionTitle}>📍 Room Information</h4>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Floor:</label>
                                        <select
                                            value={newSlot.floor}
                                            onChange={(e) => setNewSlot({...newSlot, floor: e.target.value, roomId: '', roomLabel: ''})}
                                            style={styles.input}
                                            required
                                        >
                                            <option value="">Select Floor</option>
                                            {availableFloors.map(f => (
                                                <option key={f} value={f}>{`${f}th Floor`}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Room Type:</label>
                                        <select
                                            value={newSlot.roomType}
                                            onChange={(e) => setNewSlot({...newSlot, roomType: e.target.value})}
                                            style={styles.input}
                                            required
                                        >
                                            <option value="classroom">🏫 Classroom</option>
                                            <option value="lab">🧪 Laboratory</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Room:</label>
                                        <select
                                            value={newSlot.roomId}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) {
                                                    setNewSlot({...newSlot, roomId: '', roomLabel: ''});
                                                    return;
                                                }
                                                const found = availableRooms.find(r => r.id === val);
                                                setNewSlot({...newSlot, roomId: val, roomLabel: found?.label || ''});
                                            }}
                                            style={styles.input}
                                            required
                                            disabled={!newSlot.floor}
                                        >
                                            <option value="">Select Room</option>
                                            {availableRooms.map(r => (
                                                <option key={r.id} value={r.id}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formSection}>
                                <h4 style={styles.formSectionTitle}>⏰ Time Slot Configuration</h4>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Date:</label>
                                        <input
                                            type="date"
                                            value={newSlot.slotDate}
                                            onChange={(e) => setNewSlot({...newSlot, slotDate: e.target.value})}
                                            style={styles.input}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Duration:</label>
                                        <select
                                            value={`${newSlot.startTime}-${newSlot.endTime}`}
                                            onChange={(e) => {
                                                const [start, end] = e.target.value.split('-');
                                                setNewSlot({...newSlot, startTime: start, endTime: end});
                                            }}
                                            style={styles.input}
                                            required
                                        >
                                            <option value="">Select Time Slot</option>
                                            {getTimeSlotOptions().map(slot => (
                                                <option key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    type="submit"
                                    disabled={creatingSlot}
                                    style={{
                                        ...styles.submitButton,
                                        backgroundColor: creatingSlot ? '#9ca3af' : styles.submitButton.background
                                    }}
                                >
                                    {creatingSlot ? '⏳ Creating Slot...' : '✨ Create Time Slot'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewSlot({
                                        roomId: '',
                                        roomLabel: '',
                                        roomType: 'classroom',
                                        floor: '',
                                        slotDate: '',
                                        startTime: '',
                                        endTime: ''
                                    })}
                                    style={styles.resetButton}
                                >
                                    🔄 Reset Form
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    backButton: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #6366f1, #8b5cf6)',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    },
    titleSection: {
        textAlign: 'center',
        flex: 1,
        margin: '0 24px',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '32px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    subtitle: {
        margin: 0,
        fontSize: '16px',
        color: '#6b7280',
        fontWeight: '500',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    adminBadge: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.5px',
    },
    userEmail: {
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
    },
    summaryContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    },
    summaryCard: {
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    cardIcon: {
        fontSize: '48px',
        opacity: 0.8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        margin: '0 0 8px 0',
        fontSize: '14px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    summaryNumber: {
        fontSize: '36px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: '8px 0',
        lineHeight: 1,
    },
    cardSubtext: {
        fontSize: '12px',
        color: '#9ca3af',
        fontWeight: '500',
    },
    tabContainer: {
        display: 'flex',
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    tab: {
        flex: 1,
        padding: '16px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        color: '#6b7280',
        transition: 'all 0.3s ease',
        borderRight: '1px solid rgba(229, 231, 235, 0.3)',
    },
    activeTab: {
        flex: 1,
        padding: '16px 24px',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '700',
        borderRight: '1px solid rgba(229, 231, 235, 0.3)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    tabContent: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        minHeight: '500px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f3f4f6',
    },
    sectionTitle: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '700',
        color: '#111827',
    },
    filterControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    filterLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#6b7280',
        padding: '8px 16px',
        background: '#f3f4f6',
        borderRadius: '8px',
    },
    modernRoomCard: {
        marginBottom: '24px',
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
    },
    modernRoomHeader: {
        padding: '24px',
        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roomIconSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    roomIcon: {
        fontSize: '32px',
        padding: '12px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    roomTitle: {
        margin: '0 0 4px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
    },
    roomMeta: {
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500',
    },
    slotCount: {
        textAlign: 'center',
        padding: '12px 16px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    slotCountNumber: {
        display: 'block',
        fontSize: '24px',
        fontWeight: '800',
        color: '#667eea',
    },
    slotCountLabel: {
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    modernSlotsList: {
        padding: '24px',
    },
    modernSlotItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        marginBottom: '12px',
        background: '#f8fafc',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    slotMainInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flex: 1,
    },
    slotTimeInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    slotDate: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#111827',
    },
    slotTime: {
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '500',
    },
    slotDuration: {
        fontSize: '12px',
        color: '#9ca3af',
        fontWeight: '600',
    },
    slotStatus: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    slotActions: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    modernToggleButton: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    modernDeleteButton: {
        padding: '8px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    },
    modernBookingItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        marginBottom: '12px',
        background: '#f8fafc',
        borderRadius: '12px',
        borderLeft: '4px solid #667eea',
        transition: 'all 0.3s ease',
    },
    bookingMainInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flex: 1,
    },
    teacherInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    teacherIcon: {
        fontSize: '24px',
    },
    teacherEmail: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '700',
        color: '#111827',
    },
    bookingTime: {
        display: 'block',
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500',
    },
    bookingDuration: {
        padding: '6px 12px',
        background: '#e0e7ff',
        color: '#3730a3',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
    },
    emptyStateCard: {
        textAlign: 'center',
        padding: '60px 40px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '2px dashed #d1d5db',
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '16px',
        opacity: 0.6,
    },
    createFirstSlotButton: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginTop: '16px',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    form: {
        maxWidth: '800px',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
    },
    formSection: {
        marginBottom: '32px',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
    },
    formSectionTitle: {
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        backgroundColor: '#ffffff',
    },
    formActions: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-start',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '2px solid #f3f4f6',
    },
    submitButton: {
        padding: '16px 32px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        marginTop: '24px',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.3s ease',
    },
    resetButton: {
        padding: '16px 24px',
        background: '#f3f4f6',
        color: '#374151',
        border: '2px solid #d1d5db',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    loading: {
        textAlign: 'center',
        padding: '80px 40px',
        color: 'white',
        fontSize: '18px',
        fontWeight: '600',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#ef4444',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        border: '2px solid #ef4444',
        marginBottom: '24px',
        fontSize: '16px',
        fontWeight: '600',
    },
    retryButton: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'block',
        margin: '16px auto 0',
        fontSize: '14px',
        fontWeight: '600',
    },
};

export default AdminDashboard;