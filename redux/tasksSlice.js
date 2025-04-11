import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosapis'; 

export const fetchTasksByGoal = createAsyncThunk(
    'tasks/fetchByGoal',
    async (goalId) => {
        const res = await api.get(`/task/${goalId}`);
        return { tasks: res.data, goalId };
    }
);

export const createTask = createAsyncThunk('tasks/createTask', async (data) => {
    const res = await api.post('/task', data);
    return res.data.task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
    await api.delete(`/task/${id}`);
    return id;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        selectedGoalId: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTasksByGoal.fulfilled, (state, action) => {
            state.tasks = action.payload.tasks;
            state.selectedGoalId = action.payload.goalId;
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            state.tasks.push(action.payload)
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
        });
    },
});

export default tasksSlice.reducer;
