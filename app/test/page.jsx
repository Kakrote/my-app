'use client';
import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function ResizeTest() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Resizable Event',
      start: new Date(2025, 3, 14, 9, 0),
      end: new Date(2025, 3, 14, 11, 0),
      draggable: true,
    },
  ]);

  const handleResize = ({ event, start, end }) => {
    console.log('📐 Resize fired', event.title);
    const updated = {
      ...event,
      start,
      end,
    };
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updated : e))
    );
  };

  return (
    <div className="h-screen p-8">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        resizable
        draggableAccessor="draggable"
        onEventResize={handleResize}
        style={{ height: '80vh' }}
      />
    </div>
  );
}
