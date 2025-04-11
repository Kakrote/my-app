
'use client';

import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react'; // optional icon
import { useDispatch } from 'react-redux';
import { deleteTask } from '@/redux/tasksSlice';

export default function DraggableTask({ task }) {

    const dispatch=useDispatch()
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = () => {
    if (confirm(`Delete task "${task.name}"?`)) {
      dispatch(deleteTask(task._id));
    }
  };

  return (
    <div
      ref={dragRef}
      className="p-2 bg-blue-400 border rounded flex justify-between   shadow-sm cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 ,
        backgroundColor: task.color,
        color: 'black',
        fontWeight: 500,
      }}
    >
        <span>
      {task.name}
        </span>
        <span>
      <button onClick={handleDelete} className="text-amber-900 hover:text-red-700 hover:scale-110 duration-300 text-xs">
        <Trash2 size={14} />
      </button>

        </span>
    </div>
  );
}
