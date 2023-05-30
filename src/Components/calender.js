import { Wrapper, CalenderHead, SevenColGrid, HeadDay, CalenderBody, StyledDay, StyledEvent } from "./styled"
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';
import { Days, MONTHS } from "./const";
import { range, getDaysInMonth, getSortedDays, areDatesTheSame, getDateobj } from "./util";
import { useState, useEffect, useRef } from "react";
import { EventModal } from "./addEventModal/addEventModal";
import "./addEventModal/addEventModal.css";

export const Calender = ({ startingDate, eventsArr, addEvent, editEvent, removeEvent, remindersArr, removeReminder, snoozeForReminder }) => {

    const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
    const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());
    const DaysInMonth = getDaysInMonth(currentMonth, currentYear);
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventForm, setEventForm] = useState(null);
    const [reminderModal, setReminderModal] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const reminderSelectRef = useRef(null);

    const [Modal, setModal] = useState(false);

    const toggelModal = () => {
        setModal(!Modal);
    };

    const toggelReminderModal = () => {
        setReminderModal(!reminderModal);
    };

    const nextMonth = () => {
        if (currentMonth < 11) {
            setCurrentMonth((prev) => prev + 1);
        }
        else {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth((prev) => prev - 1);
        }
        else {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        }
    };

    const loadData = (thisevent) => {
        const eventOnDay = eventsArr.find((event) =>
            event.title === thisevent.title &&
            event.date === thisevent.date &&
            event.reminderTime === thisevent.reminderTime
        );
        setEventForm(eventOnDay || null);
        setSelectedEvent(eventOnDay);
    }

    const onAddEditEvent = (event, data, selectedDay, reminderVal) => {
        event.preventDefault();

        const [eventHours, eventMinutes] = data.eventTime.split(":").map(Number);
        const eventTime = new Date(
            selectedDay.getFullYear(),   // Year
            selectedDay.getMonth(),   // Month (0-based)
            selectedDay.getDate(),  // Day
        );
        eventTime.setHours(eventHours);
        eventTime.setMinutes(eventMinutes);

        const reminderTimeDate = new Date(eventTime.getTime() - reminderVal * 60000);
        if (reminderVal != "") {

            if (reminderTimeDate < new Date()) {
                alert("Please select reminder value greater than the current time!!")
            }
            else {
                if (selectedEvent) {
                    editEvent(selectedEvent, data, selectedDay, reminderTimeDate);
                    setSelectedEvent(null);
                }
                else {
                    addEvent(data, selectedDay, reminderTimeDate);
                }
                toggelModal();
                setEventForm(null);
            }
        }
        else {
            alert("Please select reminder value!!");
        }
    }

    const onRemoveEvent = (eventToBeDel) => {
        removeEvent(eventToBeDel);
        toggelModal();
        setEventForm(null);
        setSelectedEvent(null);
    }

    const dismissReminder = (reminder) => {
        removeReminder(reminder);
    }

    const convertMilliseconds = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;

        let result = '';

        if (days > 0) {
            result += `${days} day(s) `;
        }
        if (remainingHours > 0) {
            result += `${remainingHours} hr `;
        }
        if (remainingMinutes > 0) {
            result += `${remainingMinutes} min`;
        }

        return result.trim();
    };

// moment library

    const snoozeReminder = (reminder, snoozeVal) => {
        // var snoozeValinmillisec;
        const eventTime = new Date(
            parseInt(reminder.eventFullDate.slice(0, 4)),
            parseInt(reminder.eventFullDate.slice(5, 7)) - 1,
            parseInt(reminder.eventFullDate.slice(8, 10)),
            parseInt(reminder.eventFullDate.slice(11, 13)),
            parseInt(reminder.eventFullDate.slice(14, 16))
        );

        const snoozeTime = new Date(eventTime.getTime() - snoozeVal * 60000);
        // if(snoozeTime > new Date()){

        //     console.log(snoozeTime)
        // }

        if (snoozeVal != "") {
            // snoozeValinmillisec = parseInt(snoozeVal) * 60000;
            if (snoozeTime < new Date()) {
                alert("not possible");
            }
            else {
                // alert("all ok");
                snoozeForReminder(reminder, snoozeTime);
                toggelReminderModal();
            }
        }
        else {
            alert("please select snooze val!");
        }
    }


    return (
        <Wrapper>
            <CalenderHead className="row">
                <div className="col-8 d-flex justify-content-around align-items-center">
                    <Icon.ArrowLeftCircleFill onClick={prevMonth} type="button" />
                    <p className="mb-0 fs-3"><strong>{MONTHS[currentMonth]} {currentYear}</strong></p>
                    <Icon.ArrowRightCircleFill onClick={nextMonth} type="button" />
                </div>
                <div className="col-4 d-flex justify-content-end border-start border-2">
                    <button className="reminder-btn d-flex align-items-center position-relative" onClick={toggelReminderModal}>
                        <span className="remd-num me-2">{remindersArr.length}</span>
                        <Icon.Bell className="me-2" />
                        <p className="mb-0">Reminder</p>
                    </button>
                    {
                        reminderModal &&
                        <div className="modal">
                            <div onClick={toggelReminderModal} className="overlay">
                                <div className="remd-modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="d-flex justify-content-start form-heading align-items-center">
                                        <div className="position-relative">
                                            <Icon.Bell className="me-3 fs-2" />
                                            <span className="remd-num-badge text-center">{remindersArr.length}</span>
                                        </div>
                                        <h4 className="mb-0">Reminder</h4>
                                    </div>
                                    <button type="button" className="close-btn" onClick={toggelReminderModal}><Icon.XLg /></button>
                                    <div className="modal-body">
                                        {remindersArr.length > 0 ?
                                            (remindersArr.map((reminder, index) =>
                                                <div key={index} className="p-2 border-bottom border-2">
                                                    <div className="d-flex justify-content-between ">
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <Icon.Calendar3 className="me-3" />
                                                            <p className="mb-0">"{reminder.title}" event</p>
                                                        </div>
                                                        <small>starts in {convertMilliseconds(reminder.remainingTime)} minutes</small>
                                                    </div>
                                                    <div className="d-flex justify-content-between my-3">
                                                        <div className="d-flex justify-content-start">
                                                            <select className="form-select me-4 snooze-select" aria-label="Default select example">
                                                                <option value="">-----snooze-----</option>
                                                                {/* add array.map here */}
                                                                <option value="5">5 min before</option>
                                                                <option value="10">10 min before</option>
                                                                <option value="15">15 min before</option>
                                                                <option value="20">20 min before</option>
                                                                <option value="25">25 min before</option>
                                                                <option value="30">30 min before</option>
                                                                {/* <option value="60">1 hr before</option>
                                                                <option value="1440">1 day before</option>
                                                                <option value="10080">1 week before</option> */}
                                                            </select>
                                                            <button className="snooze-btn" onClick={(e) => {
                                                                e.stopPropagation();
                                                                snoozeReminder(reminder, e.target.parentNode.querySelector('.snooze-select').value);
                                                                ;
                                                            }}>Snooze</button>
                                                        </div>
                                                        <button className="dissmiss-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            dismissReminder(reminder);
                                                        }}>Dissmiss</button>
                                                    </div>
                                                </div>
                                            )) :
                                            (
                                                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                                    <p>No reminders yet</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </CalenderHead>
            <SevenColGrid>
                {getSortedDays(currentMonth, currentYear).map((day) => (
                    <HeadDay><strong>{day}</strong></HeadDay>
                ))}
            </SevenColGrid>
            <CalenderBody fourCol={DaysInMonth === 28}>
                {range(DaysInMonth).map((day) => {

                    return (
                        <>
                            <StyledDay
                                // onClick={(e) => onAddEvent(e, getDateobj(day, currentMonth, currentYear))}
                                onClick={(e) => {
                                    setSelectedDay(getDateobj(day, currentMonth, currentYear));
                                    setEventForm(null);
                                    setShowDeleteButton(false);
                                    toggelModal();
                                }}
                                active={
                                    areDatesTheSame(new Date(), getDateobj(day, currentMonth, currentYear))
                                }>
                                <div className="mb-2">
                                    <strong className="current-day">{day}</strong>
                                </div>
                                {
                                    eventsArr.map((event) =>
                                        areDatesTheSame(
                                            getDateobj(day, currentMonth, currentYear),
                                            event.date
                                        )
                                        &&
                                        <StyledEvent
                                        color={event.color}>
                                            <span className="w-100 text-start" type="button" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDay(getDateobj(day, currentMonth, currentYear));
                                                loadData(event);
                                                setShowDeleteButton(true);
                                                toggelModal();
                                            }}>{event.title}</span>
                                        </StyledEvent>
                                    )
                                }
                            </StyledDay>

                        </>
                    )
                })}
            </CalenderBody>
            {Modal &&
                <div className="modal">
                    <div onClick={() => {
                        setSelectedEvent(null);
                        toggelModal();
                    }} className="overlay">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h4 className="form-heading">Event</h4>
                            <button type="button" className="close-btn" onClick={() => {
                                setSelectedEvent(null);
                                toggelModal();
                            }}><Icon.XLg /></button>
                            {
                                showDeleteButton &&
                                <button className="delete-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveEvent(eventForm);
                                }}><Icon.Trash3 /></button>
                            }
                            <form>
                                <div className="form-group mb-3">
                                    <label className="form-label">Title</label>
                                    <input className="form-control" value={eventForm ? eventForm.title : ""} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} type="text" placeholder="Event Tilte" required></input>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" rows="3" value={eventForm ? eventForm.desc : ""} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Event description" required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Event Time</label>
                                    <input className="form-control" value={eventForm ? eventForm.eventTime : ""} onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })} type="text" placeholder="hh:mm" required></input>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Reminder Time</label>
                                    <select className="form-control form-select me-4 reminder-select" aria-label="Default select example" ref={reminderSelectRef}>
                                        <option value="">-----REMINDER-----</option>
                                        <option value="5">5 min before</option>
                                        <option value="10">10 min before</option>
                                        <option value="15">15 min before</option>
                                        <option value="20">20 min before</option>
                                        <option value="25">25 min before</option>
                                        <option value="30">30 min before</option>
                                        <option value="60">1 hr before</option>
                                        <option value="1440">1 day before</option>
                                        <option value="10080">1 week before</option>
                                    </select>
                                    {/* <input className="form-control" value={eventForm ? eventForm.reminderTime : ""} onChange={(e) => setEventForm({ ...eventForm, reminderTime: e.target.value })} type="text" placeholder="hh:mm" required></input> */}
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Color: </label>
                                    <input
                                        type="color"
                                        className="form-control"
                                        value={eventForm ? eventForm.color : "#c0f576"}
                                        onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
                                    />
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button className="save-event" onClick={(e) => {
                                        e.stopPropagation();
                                        console.log();
                                        onAddEditEvent(e, eventForm, selectedDay, reminderSelectRef.current.value);
                                    }}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }

        </Wrapper>
    )
}