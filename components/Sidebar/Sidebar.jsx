'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksByGoal } from '@/redux/tasksSlice';
import { fetchGoals } from '@/redux/goalsSlice';
import DraggableTask from './DraggableTask';
import AddTask from './AddTask';

export default function Sidebar() {
  const dispatch = useDispatch();
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const goals = useSelector((state) => state.goals.goals);
  const tasks = useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleGoalClick = (goal) => {
    setSelectedGoalId(goal._id); // correct
    dispatch(fetchTasksByGoal(goal._id)); // pass _id to thunk
  };

  return (
    <div className="w-[20%] bg-gray-100 text-black p-4 border-r min-h-screen rounded-lg mr-1">
        <AddTask/>
      <h2 className="font-bold text-lg mb-2">Goals</h2>
      <ul className="mb-4 space-y-2">
        {goals.map((goal) => (
          <li
            key={goal._id}
            className={`cursor-pointer p-2 rounded ${
              selectedGoalId === goal._id ? 'bg-blue-200' : 'bg-white'
            }`}
            onClick={() => handleGoalClick(goal)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: goal.color }}
              />
              {goal.name}
            </div>
          </li>
        ))}
      </ul>

      {selectedGoalId && (
        <>
          <h3 className="font-semibold mb-2">Tasks</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <DraggableTask key={task._id || task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
