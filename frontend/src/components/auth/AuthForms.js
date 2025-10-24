import React, { useState } from "react";
import { AuthInput, AuthButton } from "../ui/AuthComponents";
import { COLORS } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";

export function LoginForm({ setAuthMode }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, clearError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        clearError();

        const result = await login({ email, password });
        
        if (!result.success) {
            console.error('Login failed:', result.message);
        }
        
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{
                    backgroundColor: '#ffe6e6',
                    color: '#d63384',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            <AuthInput 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email ID" 
                required 
                disabled={isSubmitting}
            />
            <AuthInput 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                disabled={isSubmitting}
            />
            <AuthButton disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
            </AuthButton>
            <p style={{ marginTop: 20, fontSize: 14, color: COLORS.lightText }}>
                Don't have an account?{' '}
                <span 
                    onClick={() => !isSubmitting && setAuthMode('signup')} 
                    style={{ 
                        color: '#fff', 
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                        fontWeight: 600,
                        opacity: isSubmitting ? 0.6 : 1
                    }}
                >
                    Sign Up
                </span>
            </p>
        </form>
    );
}

export function SignUpForm({ setAuthMode }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, error, clearError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        clearError();

        const result = await register({ email, password, role });
        
        if (!result.success) {
            console.error('Registration failed:', result.message);
        }
        
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{
                    backgroundColor: '#ffe6e6',
                    color: '#d63384',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            <AuthInput 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email ID" 
                required 
                disabled={isSubmitting}
            />
            <AuthInput 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                disabled={isSubmitting}
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
                style={{
                    width: "100%",
                    padding: 12,
                    margin: "8px 0",
                    border: "none",
                    borderRadius: 7,
                    background: isSubmitting ? '#f0f0f0' : COLORS.fieldGrey,
                    color: COLORS.fieldText,
                    fontSize: 16,
                    boxSizing: "border-box",
                    opacity: isSubmitting ? 0.6 : 1
                }}
            >
                <option value="student">I am a Student</option>
                <option value="teacher">I am a Teacher</option>
            </select>
            <AuthButton disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </AuthButton>
            <p style={{ marginTop: 20, fontSize: 14, color: COLORS.lightText }}>
                Already have an account?{' '}
                <span 
                    onClick={() => !isSubmitting && setAuthMode('login')} 
                    style={{ 
                        color: '#fff', 
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                        fontWeight: 600,
                        opacity: isSubmitting ? 0.6 : 1
                    }}
                >
                    Login
                </span>
            </p>
        </form>
    );
}