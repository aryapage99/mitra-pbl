import React from "react";
import { COLORS } from "../../styles/colors";

export function Sidebar({ show, onClose, onLogout }) {
    if (!show) return null;
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: COLORS.logoBlue,
            color: "#FFF", zIndex: 1010, boxShadow: "2px 0 22px #dde3e8", paddingTop: 57, transition: "left 0.22s"
        }}>
            <div style={{ fontWeight: 700, fontSize: 22, margin: "0 0 24px 28px" }}>MITRA</div>
            <div onClick={onLogout} style={{ padding: "12px 28px", cursor: "pointer", fontWeight: 600 }}>Logout</div>
            <div style={{ padding: "12px 28px", cursor: "pointer", fontWeight: 600 }}>Settings</div>
            <div style={{ padding: "12px 28px", cursor: "pointer", fontWeight: 600 }}>Help</div>
            <div style={{ position: "absolute", top: 12, right: 12, fontSize: 24, cursor: "pointer" }} onClick={onClose}>×</div>
        </div>
    );
}

export function ProfileMenu({ show, onLogout, user, onViewBookings, onViewTimetables, onViewAdminDashboard }) {
    if (!show) return null;
    return (
        <div style={{
            position: "absolute", top: 60, right: 10, background: "#fff", borderRadius: 10,
            boxShadow: "0 2px 18px #dde3e8", minWidth: 180, padding: "12px 8px", zIndex: 810
        }}>
            <div style={{padding: "8px 16px", borderBottom: "1px solid #eee"}}>
                <div style={{fontWeight: 600, color: COLORS.logoBlue}}>{user.email}</div>
                <div style={{fontSize: 12, color: COLORS.lightText, textTransform: 'capitalize'}}>{user.role}</div>
            </div>
            {user.role === 'admin' && (
                <div 
                    onClick={onViewAdminDashboard} 
                    style={{ 
                        fontWeight: 600, 
                        color: COLORS.logoBlue, 
                        cursor: "pointer", 
                        padding: "12px 16px", 
                        textAlign: "center",
                        borderBottom: "1px solid #eee"
                    }}
                >
                    Admin Dashboard
                </div>
            )}
            {user.role === 'teacher' && (
                <>
                    <div 
                        onClick={onViewTimetables} 
                        style={{ 
                            fontWeight: 600, 
                            color: COLORS.logoBlue, 
                            cursor: "pointer", 
                            padding: "12px 16px", 
                            textAlign: "center",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        View Timetables
                    </div>
                    <div 
                        onClick={onViewBookings} 
                        style={{ 
                            fontWeight: 600, 
                            color: COLORS.logoBlue, 
                            cursor: "pointer", 
                            padding: "12px 16px", 
                            textAlign: "center",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        My Bookings
                    </div>
                </>
            )}
            <div onClick={onLogout} style={{ fontWeight: 600, color: COLORS.logoRed, cursor: "pointer", padding: "12px 16px", textAlign: "center" }}>
                Logout
            </div>
        </div>
    );
}