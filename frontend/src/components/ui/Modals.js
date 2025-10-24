import React from "react";
import { COLORS } from "../../styles/colors";
import { today, DUMMY_SCHEDULE } from "../../data/scheduleData";

export function ModalTab({ room, onClose }) {
    const isSpace = room.type === "classroom" || room.type === "lab";
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: COLORS.modalOverlay, zIndex: 1300, display: "flex",
            alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                background: "#fff", borderRadius: 20, boxShadow: "0 2px 38px #1d205944",
                minWidth: 330, maxWidth: "90vw", padding: "34px 27px", position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", right: 16, top: 16, fontSize: 28,
                    background: "none", color: "#bbc6d6", border: "none", cursor: "pointer"
                }}>×</button>
                {isSpace ? (
                    <>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#222", marginBottom: 8 }}>Schedule for {room.label}</div>
                        <div style={{ fontSize: 16, color: "#71788e", marginBottom: 20 }}>{today}</div>
                        <div style={{
                            background: "#edf5fd", borderRadius: 14, padding: "18px 16px",
                            display: "flex", alignItems: "center", gap: 18, marginTop: 4
                        }}>
                            <div style={{ color: "#388be9", fontWeight: 700, fontSize: 18 }}>All Day</div>
                            <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: "#434d5f" }}>Vacant</div>
                        </div>
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

export function BookingModal({ room, onClose }) {
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
                <div style={{ fontSize: 16, color: "#71788e", marginBottom: 24 }}>{today}</div>
                
                <div style={{maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px'}}>
                    {DUMMY_SCHEDULE.map((slot, index) => (
                        <div key={index} style={{
                            background: "#edf5fd", borderRadius: 14, padding: "12px 16px",
                            display: "flex", alignItems: "center", gap: 18, marginBottom: 10
                        }}>
                            <div style={{ color: COLORS.logoBlue, fontWeight: 700, fontSize: 16, width: 120 }}>{slot.time}</div>
                            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: slot.status === 'Available' ? 'green' : COLORS.logoRed }}>
                                {slot.status === 'Booked' ? `Booked by ${slot.by}` : slot.status}
                            </div>
                            {slot.status === 'Available' && (
                                <button
                                    onClick={() => alert(`Slot ${slot.time} booked for ${room.label}!`)}
                                    style={{
                                        padding: '8px 16px', fontSize: 14, fontWeight: 600,
                                        backgroundColor: COLORS.logoBlue, color: 'white',
                                        border: 'none', borderRadius: 8, cursor: 'pointer'
                                    }}
                                >
                                    Book
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}