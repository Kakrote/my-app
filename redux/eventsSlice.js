import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosapis'; 


export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const res = await api.get('/event');
  return res.data;
});


export const createEvent = createAsyncThunk('events/createEvent', async (data) => {
  const res = await api.post('/event', data);
  return res.data.event;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id) => {
    await api.delete(`/event/${id}`);
    return id;
  });

  
export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async (eventData) => {
      const res = await api.put(`/event/${eventData._id}`, eventData);
      return res.data;
    }
  );
  

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e._id !== action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      });
           
      
  },
});

export default eventsSlice.reducer;