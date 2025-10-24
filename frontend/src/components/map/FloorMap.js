import React from "react";
import { RoomCard, Corridor } from "./RoomComponents";

export function FloorMap({ floorData, hover, setHover, setSelectedRoom, user, onBookClick }) {
    const renderRooms = (arr) => {
        if (!Array.isArray(arr)) return null; // Defensive check to prevent crash
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 10 }}>
                {arr.map((room, idx) => (
                    <RoomCard 
                        key={room.id} 
                        room={room} 
                        hover={hover} 
                        setHover={setHover} 
                        setSelectedRoom={setSelectedRoom} 
                        colorIndex={idx}
                        user={user} 
                        onBookClick={onBookClick}
                    />
                ))}
            </div>
        );
    }

    return (
        <div style={{
            display: "grid", gridTemplateColumns: "1fr 0.17fr 1fr 0.17fr 1fr",
            gap: 10, alignItems: "start", marginBottom: 8
        }}>
            {renderRooms(floorData.leftBlock)}
            <Corridor label="" vertical setSelectedRoom={setSelectedRoom} />
            <div>
                {renderRooms(floorData.centerBlock)}
                <Corridor label="Corridor" vertical={false} setSelectedRoom={setSelectedRoom} />
                {renderRooms(floorData.labsBlock)}
                <Corridor label="" vertical={false} setSelectedRoom={setSelectedRoom} />
                {renderRooms(floorData.canteenBlock)}
            </div>
            <Corridor label="" vertical setSelectedRoom={setSelectedRoom} />
            {renderRooms(floorData.rightBlock)}
        </div>
    );
}