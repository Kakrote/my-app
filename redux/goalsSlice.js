import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosapis';

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const res = await api.get('/goal');
  return res.data;
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
      });
  },
});

export default goalsSlice.reducer;
