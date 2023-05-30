import { Days } from "./const";

export const range = (end) => {
    const { result } = Array.from({ length: end }).reduce(({ result, current }) => ({
        result: [...result, current],
        current: current + 1
    }), { result: [], current: 1 })

    return result;
}

export const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
}

export const getSortedDays = (month, year) => {
    const dayIndex = new Date(year, month, 1).getDay();
    return [...Days.slice(dayIndex), ...Days.slice(0, dayIndex)];
}

export const getDateobj = (day, month, year) => {
    return new Date(year, month, day);
}

export const areDatesTheSame = (first, second) => {
    const   secondDate = new Date(second);
    return (
        first.getFullYear() === secondDate.getFullYear() &&
        first.getMonth() === secondDate.getMonth() &&
        first.getDate() === secondDate.getDate()
    );
} 

 // useEffect(() => {
    //     // Check for events and schedule notifications
    //     eventsArr.forEach((event) => {
    //         const eventDate = new Date(event.date);
    //         if (eventDate > new Date()) {
    //             const timeUntilEvent = eventDate.getTime() - Date.now();
    //             setTimeout(() => {
    //                 console.log(event.title);
    //             }, timeUntilEvent);
    //         }
    //     });
    // }, [eventsArr]);