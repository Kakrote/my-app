'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  fetchEvents,
  createEvent,
  deleteEvent,
} from '@/redux/eventsSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import { useDrop } from 'react-dnd';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [titleValue, setTitleValue] = useState('');
  const [colorValue, setColorValue] = useState('#2563eb');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'TASK',
    drop: (task) => handleTaskDrop(task),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleTaskDrop = (task) => {
    setDraggedTask(task);
    setTitleValue(task.name || '');
    setColorValue(task.color || '#2563eb');
    alert(`Task "${task.name}" dragged. Now click on a slot to place it.`);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setShowModal(true);
  };

  const handleEventAdd = (e) => {
    e.preventDefault();
    const newEvent = {
      title: titleValue,
      start: selectedSlot.start,
      end: selectedSlot.end,
      color: colorValue,
      category: 'default',
    };
    dispatch(createEvent(newEvent))
    .then(()=>{
        toast.success('✅ Event added!');
    });
    setDraggedTask(null);
    setTitleValue('');
    setColorValue('#2563eb');
    setShowModal(false);
  };

  const handleEventClick = (event) => {
    if (confirm(`Delete event "${event.title}"?`)) {
      dispatch(deleteEvent(event._id))
      .then(() => {
        toast.success('🗑️ Event deleted');
      });
    }
  };

  return (
    <div className="p-4 mx-auto border rounded-lg w-[80%]">
      <h2 className="text-xl font-bold mb-4">My Calendar</h2>

      <div ref={dropRef} className={`${isOver ? 'bg-blue-50 rounded-md' : ''}`}>
        <Calendar
          localizer={localizer}
          events={events.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          style={{ height: 600, padding: 8, color: 'black' }}
          components={{
            event: ({ event }) => (
              <div
                style={{
                  backgroundColor: event.color || '#2563eb',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                {event.title}
              </div>
            ),
          }}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[320px] animate-scale-in">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add Event</h3>
            <form onSubmit={handleEventAdd}>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                className="w-full text-black border p-2 mb-3"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                required
              />

              <label className="block mb-1 font-medium text-sm text-gray-700">Start Date & Time</label>
              <input
                type="datetime-local"
                className="w-full text-black border p-2 mb-3"
                value={
                  selectedSlot?.start
                    ? new Date(selectedSlot.start).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setSelectedSlot((prev) => ({
                    ...prev,
                    start: new Date(e.target.value),
                  }))
                }
                required
              />

              <label className="block mb-1 font-medium text-sm text-gray-700">End Date & Time</label>
              <input
                type="datetime-local"
                className="w-full text-black border p-2 mb-3"
                value={
                  selectedSlot?.end
                    ? new Date(selectedSlot.end).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setSelectedSlot((prev) => ({
                    ...prev,
                    end: new Date(e.target.value),
                  }))
                }
                required
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setDraggedTask(null);
                  }}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
