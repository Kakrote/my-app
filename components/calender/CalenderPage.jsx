'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, createEvent, deleteEvent, updateEvent } from '@/redux/eventsSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import { useDrop } from 'react-dnd';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar=withDragAndDrop(Calendar)

export default function CalendarPage() {
  const [refreshKey,setRefreshKey]=useState(0)
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [titleValue, setTitleValue] = useState('');
  const [colorValue, setColorValue] = useState('#2563eb');
  const [selectedEventView, setSelectedEventView] = useState(null);
  const [editMode, setEditMode] = useState(false);

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
    dispatch(createEvent(newEvent));
    resetModal();
  };

  const handleEventClick = (event) => {
    setSelectedEventView(event);
    setEditMode(false);
  };

  const handleEventUpdate = () => {
    dispatch(updateEvent(selectedEventView));
    setEditMode(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete event "${selectedEventView.title}"?`)) {
      dispatch(deleteEvent(selectedEventView._id));
      setSelectedEventView(null);
    }
  };

  const handleEventResize = ({ event, start, end }) => {
    // console.log('Resize triggered!', { event, start, end })
    console.log("event from resize",event)
    console.log("start",start)
    console.log("end",end)
    const updatedEvent = {
      // ...event,
      _id:event._id,
      title:event.title,
      start,
      end,
    };
    dispatch(updateEvent(updatedEvent)).then(()=>{
      setRefreshKey((prev)=>prev+1)
    })
  };
  
  const handelEventDrop=({event,start,end})=>{
    const update={
      ...event,
      start,
      end,
    }
    dispatch(updateEvent(update))
  }

  const resetModal = () => {
    setDraggedTask(null);
    setTitleValue('');
    setColorValue('#2563eb');
    setShowModal(false);
  };

  return (
    <div className="p-4 mx-auto border rounded-lg w-[80%]">
      <h2 className="text-xl font-bold mb-4">My Calendar</h2>

      <div ref={dropRef} className={`${isOver ? 'bg-blue-50 rounded-md' : ''}`}>
        <DragAndDropCalendar
        key={refreshKey}
          localizer={localizer}
          events={events.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
            draggable: true,
          }))}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable={true}
          draggableAccessor="draggable"
          onEventResize={handleEventResize}
          onEventDrop={handelEventDrop}
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
                  color: 'black',
                  fontSize: '0.85rem',
                }}
              >
                {event.title}
              </div>
            ),
          }}
        />
      </div>

      {/* Event Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[320px] animate-scale-in">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add Event</h3>
            <form onSubmit={handleEventAdd}>
              <input
                type="text"
                placeholder="Event Title"
                className="w-full text-black border p-2 mb-3"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                required
              />

              <label className="block text-sm mb-1 font-medium text-gray-700">Start</label>
              <input
                type="datetime-local"
                className="w-full text-black border p-2 mb-3"
                value={selectedSlot?.start ? new Date(selectedSlot.start).toISOString().slice(0, 16) : ''}
                onChange={(e) => setSelectedSlot((prev) => ({ ...prev, start: new Date(e.target.value) }))}
                required
              />

              <label className="block text-sm mb-1 font-medium text-gray-700">End</label>
              <input
                type="datetime-local"
                className="w-full text-black border p-2 mb-3"
                value={selectedSlot?.end ? new Date(selectedSlot.end).toISOString().slice(0, 16) : ''}
                onChange={(e) => setSelectedSlot((prev) => ({ ...prev, end: new Date(e.target.value) }))}
                required
              />

              <div className="flex justify-between">
                <button type="button" onClick={resetModal} className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event View/Edit Modal */}
      {selectedEventView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[320px] animate-scale-in">
            {editMode ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Event</h3>
                <input
                  type="text"
                  className="w-full text-black border p-2 mb-3"
                  value={selectedEventView.title}
                  onChange={(e) =>
                    setSelectedEventView((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full text-black border p-2 mb-3"
                  value={new Date(selectedEventView.start).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setSelectedEventView((prev) => ({ ...prev, start: new Date(e.target.value) }))
                  }
                />
                <input
                  type="datetime-local"
                  className="w-full text-black border p-2 mb-3"
                  value={new Date(selectedEventView.end).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setSelectedEventView((prev) => ({ ...prev, end: new Date(e.target.value) }))
                  }
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEventUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Event Details</h3>
                <p className="mb-2 text-black">
                  <strong>Title:</strong> {selectedEventView.title}
                </p>
                <p className="mb-2 text-black">
                  <strong>Start:</strong> {new Date(selectedEventView.start).toLocaleString()}
                </p>
                <p className="mb-2 text-black">
                  <strong>End:</strong> {new Date(selectedEventView.end).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedEventView(null)}
                    className="bg-gray-500 px-3 py-1 rounded"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}