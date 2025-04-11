'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, fetchTasksByGoal } from '@/redux/tasksSlice';

export default function AddTask() {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.goals.goals);
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !goalId) return alert('Please select goal and enter task name');
  
    dispatch(createTask({ name, goalId, color }))
      .unwrap()
      .then(() => {
        dispatch(fetchTasksByGoal(goalId));
        setName('');
        setColor('#3b82f6');
      })
      .catch((err) => {
        console.error('❌ Error creating task:', err);
      });
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow space-y-2 mb-4">
      <select
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
        className="w-full p-2 border text-black"
        required
      >
        <option value="">Select Goal</option>
        {goals.map((g) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Task Name"
        className="w-full p-2 border text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full h-10 border"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded w-full"
      >
        Add Task
      </button>
    </form>
  );
}
