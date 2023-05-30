import './App.css';
import { Calender } from './Components/calender';
import { MockEvents, Reminders } from './Components/const';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const storedEvents = localStorage.getItem('events');
  const storedReminders = localStorage.getItem('reminders');

  const [events, setEvents] = useState(storedEvents ? JSON.parse(storedEvents) : MockEvents);

  const [reminders, setReminders] = useState(storedReminders ? JSON.parse(storedReminders) : Reminders);

  // function to convert a dateString into the date object 
  const getDateFromString = (dateString) => {
    const year = parseInt(dateString.slice(0, 4));
    const month = parseInt(dateString.slice(5, 7) - 1);
    const day = parseInt(dateString.slice(8, 10));
    const hours = parseInt(dateString.slice(11, 13));
    const minutes = parseInt(dateString.slice(14, 16));

    return new Date(year, month, day, hours, minutes);
  }

  // useEffect hook to update events in localstorage and also to setreminders
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    const intervals = []; // Array to store the setInterval identifiers

    events.forEach((event) => {
      const reminderFullDate = getDateFromString(event.reminderFullDate);
      const eventFullDate = getDateFromString(event.eventFullDate);
      const reminderFullDateUtcString = new Date(reminderFullDate.getTime() - reminderFullDate.getTimezoneOffset() * 60000).toISOString();
      const eventFullDateUtcString = new Date(eventFullDate.getTime() - eventFullDate.getTimezoneOffset() * 60000).toISOString();

      if (reminderFullDate > new Date()) {
        const checkInterval = setInterval(() => {
          const timeRemaining = reminderFullDate.getTime() - Date.now();
          if (timeRemaining <= 0) {
            clearInterval(checkInterval);
            toast.info("Reminder for the event '" + event.title + "'");
            setReminders(prev => [...prev, { title: event.title, remainingTime: eventFullDate.getTime() - Date.now(), date: event.date, eventTime: event.eventTime, reminderFullDate: reminderFullDateUtcString, eventFullDate: eventFullDateUtcString }]);
          }
        }, 1000); // Interval time in milliseconds

        intervals.push(checkInterval);
      }
    });

    // Cleanup function to clear any remaining intervals
    return () => {
      intervals.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [events]);

  // useEffect hook to update the reminders in the localstorage when they are updated 
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // useEffect hook to update the remaining time in the reminders eve
  useEffect(() => {
    const interval = setInterval(() => {
      setReminders(prev => {
        const updatedReminders = prev.map(reminder => {
          const eventFullDate = getDateFromString(reminder.eventFullDate);
          const remainingTime = eventFullDate.getTime() - Date.now();

          return (remainingTime <= 0 ? null : { ...reminder, remainingTime });

        }).filter(reminder => reminder !== null); // Filter out null reminders

        return updatedReminders;
      });
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // function to get the utcDateString, utcReminderDateString and eventTime 
  const getRemdAndEventTime = (date, data, reminderTimeDate) => {
    const utcDateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    // const utcReminderDateString = new Date(Date.UTC(reminderTimeDate.getFullYear(), reminderTimeDate.getMonth(), reminderTimeDate.getDate(), reminderTimeDate.getHours(), reminderTimeDate.getMinutes())).toISOString();
    const utcReminderDateString = new Date(reminderTimeDate.getTime() - reminderTimeDate.getTimezoneOffset() * 60000).toISOString();
    const [eventHours, eventMinutes] = data.eventTime.split(":").map(Number);
    const eventTime = new Date(Date.UTC(
      parseInt(utcDateString.slice(0, 4)),   // Year
      parseInt(utcDateString.slice(5, 7)) - 1,   // Month (0-based)
      parseInt(utcDateString.slice(8, 10)),  // Day
    ));
    eventTime.setUTCHours(eventHours);
    eventTime.setUTCMinutes(eventMinutes);

    return [utcDateString, utcReminderDateString, eventTime]
  }

  // This function will return the reminderDateTime in the hh:mm string format 
  const remindeTimeString = (reminderTimeDate) => {
    const hours = reminderTimeDate.getHours().toString().padStart(2, '0');
    const minutes = reminderTimeDate.getMinutes().toString().padStart(2, '0');
    const reminderTime = `${hours}:${minutes}`;

    return reminderTime;
  }

  // function to add an event 
  const addEvent = (data, date, reminderTimeDate) => {
    const [utcDateString, utcReminderDateString, eventTime] = getRemdAndEventTime(date, data, reminderTimeDate);
    const reminderTime = remindeTimeString(reminderTimeDate);

    setEvents(prev => [...prev,
    {
      date: utcDateString,
      title: data.title,
      desc: data.desc,
      eventTime: data.eventTime,
      reminderTime: reminderTime,
      reminderFullDate: utcReminderDateString,
      eventFullDate: eventTime.toISOString(),
      color: data.color
    }]);
  }

  // function to edit event 
  const editEvent = (eventToBeEdited, newData, date, reminderTimeDate) => {
    const [utcDateString, utcReminderDateString, eventTime] = getRemdAndEventTime(date, newData, reminderTimeDate);
    const reminderTime = remindeTimeString(reminderTimeDate);

    setEvents((prev) =>
      prev.map((event) =>
        event === eventToBeEdited
          ? {
            ...event,
            title: newData.title,
            desc: newData.desc,
            eventTime: newData.eventTime,
            reminderTime: reminderTime,
            reminderFullDate: utcReminderDateString,
            eventFullDate: eventTime.toISOString(),
            color: newData.color
          } : event
      )
    );
  }

  // function to remove an event 
  const removeEvent = (eventToBeDeleted) => {
    setEvents(prev => prev.filter(event =>
      event.title !== eventToBeDeleted.title ||
      event.date !== eventToBeDeleted.date ||
      event.reminderTime !== eventToBeDeleted.reminderTime
    ));
  };

  // function to remove the reminder 
  const removeReminder = (reminderToBeRemoved) => {
    setReminders(prev => prev.filter(reminder => reminder !== reminderToBeRemoved))
  }

  // function to snooze a reminder for an event 
  const snoozeReminder = (reminderToBeSnoozed, snoozeTime) => {
    const utcDateString = new Date(snoozeTime.getTime() - snoozeTime.getTimezoneOffset() * 60000).toISOString();
    const reminderTime = remindeTimeString(snoozeTime);
    
    setEvents((prev) =>
      prev.map((event) =>
        event.title === reminderToBeSnoozed.title &&
          event.date === reminderToBeSnoozed.date &&
          event.eventTime === reminderToBeSnoozed.eventTime
          ? { ...event, reminderTime: reminderTime, reminderFullDate: utcDateString }
          : event
      )
    );

    setReminders(prev => prev.filter(reminder => reminder !== reminderToBeSnoozed));
  }

  return (
    <div className="App">
      <ToastContainer />
      <Calender className="modal-content"
        startingDate={new Date()}
        eventsArr={events}
        addEvent={addEvent}
        editEvent={editEvent}
        removeEvent={removeEvent}
        remindersArr={reminders}
        removeReminder={removeReminder}
        snoozeForReminder={snoozeReminder}
      />
    </div>
  );
}

export default App;
