import React from "react";
import { COLORS, CLASSROOM_COLORS } from "../../styles/colors";

export function RoomCard({ room, hover, setHover, setSelectedRoom, colorIndex, user, onBookClick }) {
    const getBackground = (type) => {
        if (type === "classroom") return CLASSROOM_COLORS[colorIndex % CLASSROOM_COLORS.length];
        if (type === "lab") return "#fff7e6";
        return "#e8eaf3";
    };

    const isBookable = room.type === 'classroom' || room.type === 'lab';
    const isTeacher = user.role === 'teacher';

    const handleBookClick = (e) => {
        e.stopPropagation();
        if (isTeacher) {
            onBookClick(room);
        }
    };

    const buttonStyle = {
        marginTop: 10,
        padding: '8px 14px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        borderRadius: 8,
        width: '90%',
        backgroundColor: COLORS.logoBlue,
        color: 'white',
        transition: 'background-color 0.2s',
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#c5cde0',
        color: '#6d7588',
        cursor: 'not-allowed',
    };

    return (
        <div
            style={{
                background: getBackground(room.type), color: COLORS.logoBlue, borderRadius: 16,
                boxShadow: COLORS.roomShadow, padding: 15, minWidth: 135,
                textAlign: "center", fontWeight: 600, fontSize: 16, cursor: "pointer",
                border: hover === room.id ? "2px solid #388be9" : "1.5px solid #d1defa",
                outline: hover === room.id ? "4px solid #e2efff" : "none",
                transition: "all 0.18s cubic-bezier(.4,.2,.2,1)", boxSizing: "border-box",
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110,
            }}
            onMouseEnter={() => setHover(room.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setSelectedRoom({ ...room })}
        >
            <div style={{ flexGrow: 1}}>{room.label}</div>
            {isBookable && (
                <button
                    style={isTeacher ? buttonStyle : disabledButtonStyle}
                    disabled={!isTeacher}
                    onClick={handleBookClick}
                >
                    {isTeacher ? 'Book Slot' : 'Teacher Access'}
                </button>
            )}
        </div>
    );
}

export function Corridor({ label, vertical, setSelectedRoom }) {
    return (
        <div
            style={{
                minWidth: vertical ? 20 : 120, minHeight: vertical ? 120 : 20,
                background: COLORS.corridor, borderRadius: 12, color: "#1976d2",
                fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", margin: vertical ? "0 9px" : "9px 0",
                boxShadow: "0 2px 13px #d8e3e5", border: "1.5px dashed #b5c1cc"
            }}
            onClick={() => setSelectedRoom({ label, type: "corridor" })}
        >
            {label}
        </div>
    );
}