import { useState } from "react";
import "./Calendar.css";
import { toast } from "react-toastify";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTime, setSelectedTime] = useState("09:00");

  const [showSelector, setShowSelector] = useState(false);
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", duration: "1h" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isPastDate = (date) =>
    new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const isBooked = (dateStr, time) =>
    bookings.some((b) => b.date === dateStr && b.time === time) ||
    events.some((e) => e.date === dateStr && e.time === time);

  const handleDayClick = (day) => {
    const dateStr = formatDate(year, month, day);
    if (isPastDate(dateStr)) {
      toast.error("Cannot add event on past dates!");
      return;
    }
    setNewEvent((prev) => ({ ...prev, date: dateStr, time: selectedTime }));
    setShowAddEventModal(true);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const jumpToDate = () => {
    setCurrentDate(new Date(tempYear, tempMonth, 1));
    setShowSelector(false);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error("Please fill all event fields!");
      return;
    }
    if (isBooked(newEvent.date, newEvent.time)) {
      toast.error(`This time slot is already booked on ${newEvent.date}!`);
      return;
    }
    setEvents((prev) => [...prev, newEvent]);
    toast.success(`Event "${newEvent.title}" added!`);
    setNewEvent({ title: "", date: "", time: "", duration: "1h" });
    setShowAddEventModal(false);
  };

  return (
    <div className="calendar-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Scheduled Events</h3>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <ul className="event-list">
            {events
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((ev, i) => (
                <li key={i} className="event-list-item">
                  <strong>{ev.title}</strong> <br />
                  {ev.date} at {ev.time}
                </li>
              ))}
          </ul>
        )}
      </aside>

      {/* Calendar */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth}>←</button>
          <h2 className="month-year" onClick={() => setShowSelector(true)}>
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <button onClick={nextMonth}>→</button>
          <button onClick={() => setShowAddEventModal(true)} className="add-event-btn">
            + Add Event
          </button>
        </div>

        {showSelector && (
          <div className="month-year-selector">
            <select value={tempMonth} onChange={(e) => setTempMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(year, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select value={tempYear} onChange={(e) => setTempYear(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            <button onClick={jumpToDate}>Go</button>
            <button onClick={() => setShowSelector(false)}>Cancel</button>
          </div>
        )}

        {showAddEventModal && (
          <div className="modal-overlay" onClick={() => setShowAddEventModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Add Event</h3>
              <input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, time: e.target.value }))}
              />
              <input
                placeholder="Duration (e.g. 1h)"
                value={newEvent.duration}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, duration: e.target.value }))}
              />
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={() => setShowAddEventModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="calendar-days">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`}></div>
          ))}

          {daysArray.map((day) => {
            const dateStr = formatDate(year, month, day);
            const dayEvents = events.filter((ev) => ev.date === dateStr);
            const past = isPastDate(dateStr);

            return (
              <div
                key={day}
                className={`calendar-day ${past ? "past" : ""}`}
                onClick={() => handleDayClick(day)}
                title={past ? "Past date" : "Available"}
              >
                {day}
                <div className="events-list">
                  {dayEvents.map((ev, i) => (
                    <div key={i} className="event-chip">{ev.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
