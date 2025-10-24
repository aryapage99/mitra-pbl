export const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

export const DUMMY_SCHEDULE = [
    { time: "09:00 - 10:00", status: "Booked", by: "Prof. A. Sharma" },
    { time: "10:00 - 11:00", status: "Available", by: null },
    { time: "11:00 - 12:00", status: "Booked", by: "Prof. R. Verma" },
    { time: "12:00 - 13:00", status: "Booked", by: "Prof. S. Gupta" },
    { time: "13:00 - 14:00", status: "Lunch Break", by: null, unavailable: true },
    { time: "14:00 - 15:00", status: "Available", by: null },
    { time: "15:00 - 16:00", status: "Booked", by: "Prof. M. Khan" },
];