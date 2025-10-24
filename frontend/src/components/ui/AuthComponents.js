import React from "react";
import { COLORS } from "../../styles/colors";

export const AuthInput = (props) => (
    <input style={{
        width: "100%",
        padding: 12,
        margin: "8px 0",
        border: "none",
        borderRadius: 7,
        background: COLORS.fieldGrey,
        color: COLORS.fieldText,
        fontSize: 16,
        boxSizing: "border-box"
    }} {...props} />
);

export const AuthButton = (props) => (
    <button
        type="submit"
        style={{
            width: "100%",
            padding: "12px 0",
            marginTop: 10,
            fontSize: 17,
            fontWeight: 600,
            background: COLORS.logoRed,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            cursor: "pointer",
            transition: "background 0.2s"
        }}
        onMouseOver={(e) => { e.target.style.background = COLORS.btnHover; }}
        onMouseOut={(e) => { e.target.style.background = COLORS.logoRed; }}
        {...props}
    />
);

export const AuthFormContainer = ({ children }) => (
    <div style={{
        maxWidth: 380,
        margin: "60px auto",
        padding: "28px 38px 38px 38px",
        background: COLORS.logoBlue,
        borderRadius: 18,
        boxShadow: "0 4px 32px #e0e6ed",
        color: "#fff",
        textAlign: "center"
    }}>
        <img
            src="https://placehold.co/140x80/9B2023/FFFFFF?text=MITRA"
            alt="Mitra logo"
            style={{ width: 140, marginBottom: 20, marginTop: -6, borderRadius: 16 }}
        />
        <h2 style={{ color: COLORS.logoRed, marginBottom: 8, fontWeight: 700, letterSpacing: 2 }}>Mitra</h2>
        <div style={{ fontSize: 15, color: "#f7ddde", marginBottom: 20 }}>Interactive Room Allocator</div>
        {children}
    </div>
);