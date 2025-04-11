import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosapis';

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
    const res = await api.get('/goal');
    return res.data;
});

export const createGoal = createAsyncThunk('goals/createGoal', async (data) => {
    const res = await api.post('/goal', data);
    return res.data.goal;
});


const goalsSlice = createSlice({
    name: 'goals',
    initialState: {
        goals: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.goals = action.payload;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.goals.push(action.payload);
            });

    },
});

export default goalsSlice.reducer;
