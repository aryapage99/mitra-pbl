import React, { useState, useEffect } from "react";
import { COLORS } from "../../styles/colors";
import bookingService from "../../services/bookingService";

export function BookingHistory({ user, onBack }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const bookingsData = await bookingService.getMyBookings();
            setBookings(bookingsData || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            setDeleting(bookingId);
            await bookingService.deleteBooking(bookingId);
            
            // Remove the deleted booking from state
            setBookings(bookings.filter(b => b.id !== bookingId));
            
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert(error.message || 'Failed to cancel booking');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString.substring(0, 5); // HH:MM
    };

    const isPastBooking = (bookingDate, endTime) => {
        const bookingDateTime = new Date(`${bookingDate}T${endTime}`);
        return bookingDateTime < new Date();
    };

    // Separate upcoming and past bookings
    const upcomingBookings = bookings.filter(b => !isPastBooking(b.booking_date, b.end_time));
    const pastBookings = bookings.filter(b => isPastBooking(b.booking_date, b.end_time));

    return (
        <div style={{
            fontFamily: "'Poppins','Inter',sans-serif",
            background: "#f6f9fb",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <div style={{
                maxWidth: 900,
                margin: "0 auto"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 30,
                    gap: 15
                }}>
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
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#222",
                        margin: 0
                    }}>
                        My Bookings
                    </h1>
                </div>

                {/* User Info */}
                <div style={{
                    background: "white",
                    borderRadius: 15,
                    padding: 20,
                    marginBottom: 25,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                    <div style={{ fontSize: 16, color: "#71788e" }}>
                        Logged in as: <strong style={{ color: "#222" }}>{user.email}</strong>
                    </div>
                    <div style={{ fontSize: 14, color: "#71788e", marginTop: 5 }}>
                        Total bookings: <strong>{bookings.length}</strong>
                    </div>
                </div>

                {loading && (
                    <div style={{
                        textAlign: "center",
                        padding: 40,
                        fontSize: 16,
                        color: "#71788e"
                    }}>
                        Loading your bookings...
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

                {!loading && !error && bookings.length === 0 && (
                    <div style={{
                        background: "white",
                        borderRadius: 15,
                        padding: 40,
                        textAlign: "center",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                    }}>
                        <div style={{ fontSize: 18, color: "#71788e", marginBottom: 10 }}>
                            No bookings yet
                        </div>
                        <div style={{ fontSize: 14, color: "#9ba5b8" }}>
                            Start by booking a classroom or lab from the map view
                        </div>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <>
                        {/* Upcoming Bookings */}
                        {upcomingBookings.length > 0 && (
                            <div style={{ marginBottom: 30 }}>
                                <h2 style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "#222",
                                    marginBottom: 15
                                }}>
                                    Upcoming Bookings ({upcomingBookings.length})
                                </h2>
                                {upcomingBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onDelete={handleDelete}
                                        deleting={deleting === booking.id}
                                        formatDate={formatDate}
                                        formatTime={formatTime}
                                        isPast={false}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Past Bookings */}
                        {pastBookings.length > 0 && (
                            <div>
                                <h2 style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "#71788e",
                                    marginBottom: 15
                                }}>
                                    Past Bookings ({pastBookings.length})
                                </h2>
                                {pastBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onDelete={null}
                                        deleting={false}
                                        formatDate={formatDate}
                                        formatTime={formatTime}
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function BookingCard({ booking, onDelete, deleting, formatDate, formatTime, isPast }) {
    return (
        <div style={{
            background: "white",
            borderRadius: 15,
            padding: 20,
            marginBottom: 15,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: isPast ? "1px solid #e0e0e0" : "2px solid " + COLORS.logoBlue,
            opacity: isPast ? 0.7 : 1
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12
            }}>
                <div>
                    <div style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#222",
                        marginBottom: 5
                    }}>
                        {booking.room_label}
                    </div>
                    <div style={{
                        fontSize: 13,
                        color: "#71788e",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>
                        {booking.room_type} • Floor {booking.floor}
                    </div>
                </div>
                {!isPast && onDelete && (
                    <button
                        onClick={() => onDelete(booking.id)}
                        disabled={deleting}
                        style={{
                            background: COLORS.logoRed,
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: deleting ? "not-allowed" : "pointer",
                            opacity: deleting ? 0.6 : 1
                        }}
                    >
                        {deleting ? "Canceling..." : "Cancel"}
                    </button>
                )}
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 15,
                marginTop: 15,
                paddingTop: 15,
                borderTop: "1px solid #f0f0f0"
            }}>
                <div>
                    <div style={{ fontSize: 12, color: "#9ba5b8", marginBottom: 3 }}>Date</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>
                        {formatDate(booking.booking_date)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#9ba5b8", marginBottom: 3 }}>Time</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#9ba5b8", marginBottom: 3 }}>Duration</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>
                        {booking.duration_hours} hour{booking.duration_hours > 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
