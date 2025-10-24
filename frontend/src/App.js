import React, { useState } from "react";
import { AuthFormContainer } from "./components/ui/AuthComponents";
import { LoginForm, SignUpForm } from "./components/auth/AuthForms";
import { Sidebar, ProfileMenu } from "./components/ui/Navigation";
import { ModalTab, BookingModal } from "./components/ui/Modals";
import { FloorMap } from "./components/map/FloorMap";
import { ROOM_DATA } from "./data/roomData";
import { COLORS } from "./styles/colors";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthScreen() {
    const [authMode, setAuthMode] = useState('login');

    return (
        <div style={{ fontFamily: "'Poppins','Inter',sans-serif", background: "#f6f9fb", minHeight: "100vh" }}>
            <AuthFormContainer>
                {authMode === 'login' ?
                    <LoginForm setAuthMode={setAuthMode} /> :
                    <SignUpForm setAuthMode={setAuthMode} />
                }
            </AuthFormContainer>
        </div>
    );
}

function MainApp() {
    const { user, logout, loading } = useAuth();
    const [selectedFloor, setSelectedFloor] = useState(5);
    const [hover, setHover] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingRoom, setBookingRoom] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    if (loading) {
        return (
            <div style={{ 
                fontFamily: "'Poppins','Inter',sans-serif", 
                background: "#f6f9fb", 
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    fontSize: 18,
                    color: COLORS.logoBlue,
                    fontWeight: 600
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (!user) {
        return <AuthScreen />;
    }

    return (
        <div style={{ fontFamily: "'Poppins','Inter',sans-serif", background: "#f6f9fb", minHeight: "100vh" }}>
            <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />

            <header style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", padding: "10px 0", borderBottom: "2px solid #edf3fa", boxSizing: "border-box"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 25, paddingLeft: 26 }}>
                    <span style={{ fontSize: 28, color: COLORS.logoBlue, cursor: "pointer", marginRight: 18 }} onClick={() => setShowSidebar(true)}>
                        ☰
                    </span>
                    <img src="https://placehold.co/64x64/9B2023/FFFFFF?text=M" alt="Logo" style={{ width: 48, borderRadius: 9 }} />
                </div>
                <div style={{ position: "relative", paddingRight: 32 }}>
                    <span style={{ fontSize: 32, color: "#25A8E4", cursor: "pointer" }} onClick={() => setShowProfileMenu(prev => !prev)} title="Profile">
                        👤
                    </span>
                    <ProfileMenu show={showProfileMenu} onLogout={logout} user={user} />
                </div>
            </header>

            <main style={{
                maxWidth: 1300, margin: "40px auto", background: "#fff",
                borderRadius: 18, boxShadow: "0 4px 32px #e0e6ed", padding: 38
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: COLORS.logoRed, margin: 0 }}>
                        College Floor {selectedFloor} Map
                    </h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[5, 4].map(floor => (
                            <button
                                key={floor}
                                onClick={() => setSelectedFloor(floor)}
                                style={{
                                    padding: '10px 20px', fontSize: 16, cursor: 'pointer',
                                    backgroundColor: selectedFloor === floor ? COLORS.logoBlue : COLORS.fieldGrey,
                                    color: selectedFloor === floor ? '#fff' : COLORS.logoBlue,
                                    border: `1px solid ${selectedFloor === floor ? COLORS.logoBlue : '#ddd'}`,
                                    borderRadius: 8, fontWeight: 600
                                }}
                            >
                                Floor {floor}
                            </button>
                        ))}
                    </div>
                </div>

                <FloorMap
                    floorData={ROOM_DATA[selectedFloor]}
                    hover={hover}
                    setHover={setHover}
                    setSelectedRoom={setSelectedRoom}
                    user={user}
                    onBookClick={setBookingRoom}
                />
                <div style={{ marginTop: 20, textAlign: "center", color: "#727780" }}>
                    <span>Click any room or corridor for details.</span>
                </div>
                {selectedRoom && <ModalTab room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
                {bookingRoom && <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} />}
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}

export default App;