import { useState, FormEvent } from 'react';
import { Task, Priority, Status } from '@/types';

interface TaskFormProps {
  // RELAXED TYPE: We do not ask for createdAt/completedAt here anymore
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
}

export function TaskForm({ addTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState<number | ''>('');
  const [timeTaken, setTimeTaken] = useState<number | ''>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('Todo');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || revenue === '' || timeTaken === '') return;

    addTask({
      title,
      revenue: Number(revenue),
      timeTaken: Number(timeTaken),
      priority,
      status,
      notes
    });

    // Reset form
    setTitle('');
    setRevenue('');
    setTimeTaken('');
    setPriority('Medium');
    setStatus('Todo');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md space-y-4 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          placeholder="e.g. Client Call"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Revenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Revenue ($)</label>
          <input
            type="number"
            required
            min="0"
            value={revenue}
            onChange={(e) => setRevenue(e.target.valueAsNumber)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* Time Taken */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Time (Hours)</label>
          <input
            type="number"
            required
            min="0.1"
            step="0.1"
            value={timeTaken}
            onChange={(e) => setTimeTaken(e.target.valueAsNumber)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
}