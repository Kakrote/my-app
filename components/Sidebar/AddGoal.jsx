'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGoal } from '@/redux/goalsSlice';

export default function AddGoal() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGoal({ name, color }));
    setName('');
    setColor('#3b82f6');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow space-y-2 mb-4">
      <input
        type="text"
        placeholder="Goal Name"
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
        className="bg-green-600 text-white px-3 py-1 rounded w-full"
      >
        Create Goal
      </button>
    </form>
  );
}
