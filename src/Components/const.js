export const Days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export const MockEvents = [
    {
        date: new Date(Date.UTC(2023, 4, 1, 0, 0, 0)).toISOString() , 
        title: 'Appointment' , 
        desc: "I am having an appointment for our upcomming project with Project manager." , 
        eventTime: "10:00",
        reminderTime: "09:30",
        reminderFullDate: new Date(Date.UTC(2023, 4, 1, 9, 30, 0)).toISOString(),
        eventFullDate: new Date(Date.UTC(2023, 4, 1, 10, 30, 0)).toISOString(),
        color: "#c0f576"
    }
]

export const Reminders = [
    // {
    //     title: "Match",
    //     remainingTime: "20",
    //     date: "",
    //     eventTime: "",
    //     reminderFullDate: new Date(),
    //     eventFullDate: new Date()
    // },
    // {
    //     title: "Appointment",
    //     remainingTime: "30",
    //     date: "",
    //     eventTime: "",
    //     reminderFullDate: new Date(),
    //     eventFullDate: new Date()
    // }
]