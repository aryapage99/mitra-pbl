import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "../../styles/colors";
import { today } from "../../data/scheduleData";
import bookingService from "../../services/bookingService";

export function ModalTab({ room, onClose }) {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchBookingsAndSlots = useCallback(async () => {
        try {
            setLoading(true);
            const bookingsData = await bookingService.getRoomBookings(room.id, selectedDate);
            
            // Generate time slots based on admin-created slots and existing bookings
            const slots = await bookingService.generateTimeSlots(room.id, room.type, selectedDate, bookingsData);
            setTimeSlots(slots);
        } catch (error) {
            console.error('Error fetching bookings and slots:', error);
            setTimeSlots([]);
        } finally {
            setLoading(false);
        }
    }, [room.id, room.type, selectedDate]);

    useEffect(() => {
        if (room.type === "classroom" || room.type === "lab") {
            fetchBookingsAndSlots();
        }
    }, [room.type, fetchBookingsAndSlots]);

    const isSpace = room.type === "classroom" || room.type === "lab";

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: COLORS.modalOverlay, zIndex: 1300, display: "flex",
            alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                background: "#fff", borderRadius: 20, boxShadow: "0 2px 38px #1d205944",
                minWidth: 400, maxWidth: "90vw", padding: "34px 27px", position: "relative",
                maxHeight: "80vh", overflowY: "auto"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", right: 16, top: 16, fontSize: 28,
                    background: "none", color: "#bbc6d6", border: "none", cursor: "pointer"
                }}>×</button>
                {isSpace ? (
                    <>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#222", marginBottom: 8 }}>Schedule for {room.label}</div>
                        <div style={{ fontSize: 16, color: "#71788e", marginBottom: 15 }}>{today}</div>
                        
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                marginBottom: 20,
                                width: '100%',
                                fontSize: 14
                            }}
                        />

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 20, color: '#71788e' }}>Loading...</div>
                        ) : timeSlots.length === 0 ? (
                            <div style={{
                                background: "#edf5fd", borderRadius: 14, padding: "18px 16px",
                                textAlign: 'center', color: '#71788e'
                            }}>
                                No schedule available
                            </div>
                        ) : (
                            timeSlots.map((slot, index) => (
                                <div key={index} style={{
                                    background: slot.isBooked ? "#ffe6e6" : "#edf5fd",
                                    borderRadius: 14, padding: "12px 16px",
                                    display: "flex", alignItems: "center", gap: 18, marginBottom: 10
                                }}>
                                    <div style={{ color: COLORS.logoBlue, fontWeight: 700, fontSize: 16, width: 120 }}>
                                        {slot.displayTime}
                                    </div>
                                    <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: slot.isBooked ? COLORS.logoRed : 'green' }}>
                                        {slot.isBooked ? `Booked by ${slot.bookingInfo?.teacher_email || 'Teacher'}` : 'Available'}
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <div style={{ fontWeight: 700, fontSize: 22, color: COLORS.logoRed, margin: "35px 0 28px 0", textAlign: "center" }}>
                        {room.label}
                    </div>
                )}
            </div>
        </div>
    );
}

export function BookingModal({ room, onClose, floor }) {
    const [bookings, setBookings] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    // removed unused selectedDuration state
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const maxDuration = room.type === 'classroom' ? 1 : 2;

    const fetchBookingsAndSlots = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const bookingsData = await bookingService.getRoomBookings(room.id, bookingDate);
            setBookings(bookingsData);
            
            // Get admin-created time slots
            const slots = await bookingService.generateTimeSlots(room.id, room.type, bookingDate, bookingsData);
            setTimeSlots(slots);
        } catch (error) {
            console.error('Error fetching bookings and slots:', error);
            setError('Failed to load bookings and available slots');
            setBookings([]);
            setTimeSlots([]);
        } finally {
            setLoading(false);
        }
    }, [room.id, room.type, bookingDate]);

    useEffect(() => {
        fetchBookingsAndSlots();
    }, [fetchBookingsAndSlots]);

    const handleBook = async (startTime, endTime) => {
        try {
            setBooking(true);
            setError(null);
            setSuccess(null);

            const bookingData = {
                roomId: room.id,
                roomLabel: room.label,
                roomType: room.type,
                floor: floor,
                bookingDate,
                startTime,
                endTime
            };

            await bookingService.createBooking(bookingData);
            setSuccess(`Successfully booked ${room.label}!`);
            
            // Refresh the bookings and available slots
            await fetchBookingsAndSlots();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            console.error('Error creating booking:', error);
            setError(error.message || 'Failed to create booking');
        } finally {
            setBooking(false);
        }
    };

    // Generate duration options based on room type
    const getDurationOptions = (startTime) => {
        const options = [];
        for (let i = 1; i <= maxDuration; i++) {
            const startHour = parseInt(startTime.split(':')[0]);
            const endHour = startHour + i;
            const endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
            
            // Check if this duration would overlap with any booking
            const wouldOverlap = bookings.some(booking => {
                return startTime < booking.end_time && endTime > booking.start_time;
            });
            
            if (!wouldOverlap && endHour <= 16) {
                options.push({
                    value: i,
                    label: `${i} hour${i > 1 ? 's' : ''}`,
                    endTime
                });
            }
        }
        return options;
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: COLORS.modalOverlay, zIndex: 1300, display: "flex",
            alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                background: "#fff", borderRadius: 20, boxShadow: "0 2px 38px #1d205944",
                width: 500, maxWidth: "90vw", padding: "24px 28px", position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", right: 16, top: 16, fontSize: 28,
                    background: "none", color: "#bbc6d6", border: "none", cursor: "pointer"
                }}>×</button>
                
                <div style={{ fontSize: 20, fontWeight: 700, color: "#222", marginBottom: 8 }}>Booking for {room.label}</div>
                <div style={{ fontSize: 14, color: "#71788e", marginBottom: 15 }}>
                    {room.type === 'classroom' ? 'Max duration: 1 hour' : 'Max duration: 2 hours'}
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#ffe6e6',
                        color: '#d63384',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {success}
                    </div>
                )}
                
                <input 
                    type="date" 
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        marginBottom: 20,
                        width: '100%',
                        fontSize: 14
                    }}
                />

                <div style={{maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px'}}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 20, color: '#71788e' }}>Loading slots...</div>
                    ) : (
                        timeSlots.map((slot, index) => {
                            const durationOptions = getDurationOptions(slot.startTime);
                            
                            return (
                                <div key={index} style={{
                                    background: slot.isBooked ? "#ffe6e6" : "#edf5fd",
                                    borderRadius: 14, padding: "12px 16px",
                                    display: "flex", alignItems: "center", gap: 18, marginBottom: 10,
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ color: COLORS.logoBlue, fontWeight: 700, fontSize: 16, width: 120 }}>
                                        {slot.displayTime}
                                    </div>
                                    <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: slot.isBooked ? COLORS.logoRed : 'green' }}>
                                        {slot.isBooked ? `Booked by ${slot.bookingInfo?.teacher_email || 'Teacher'}` : 'Available'}
                                    </div>
                                    {!slot.isBooked && durationOptions.length > 0 && (
                                        <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 8 }}>
                                            {durationOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleBook(slot.startTime, option.endTime)}
                                                    disabled={booking}
                                                    style={{
                                                        padding: '6px 12px', fontSize: 13, fontWeight: 600,
                                                        backgroundColor: COLORS.logoBlue, color: 'white',
                                                        border: 'none', borderRadius: 8, cursor: booking ? 'not-allowed' : 'pointer',
                                                        opacity: booking ? 0.6 : 1,
                                                        flex: 1
                                                    }}
                                                >
                                                    {booking ? 'Booking...' : `Book ${option.label}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}