import { configureStore } from '@reduxjs/toolkit';
import goalsReducer from './goalsSlice';
import tasksReducer from './tasksSlice';
import eventsReducer from './eventsSlice';

export const store = configureStore({
  reducer: {
    goals: goalsReducer,
    tasks: tasksReducer,
    events:eventsReducer,
  },
});
