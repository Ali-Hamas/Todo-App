'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthContext } from '@/context/auth-context';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { session, isLoading, signOut } = useAuthContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks when component mounts or filter changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!session) return;

      try {
        setLoading(true);
        const tasksData = await api.getTasks(filter);
        setTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        // Check if it's a network error
        if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))) {
          console.warn('Backend not accessible. Loading mock tasks for development.');
          // Provide mock tasks for development
          const mockTasks = [
            {
              id: 1,
              title: 'Welcome to your todo app!',
              description: 'This is a sample task to get you started',
              completed: false,
              user_id: session.user?.id || 'mock-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              title: 'Create your first task',
              description: 'Add a new task using the form above',
              completed: false,
              user_id: session.user?.id || 'mock-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setTasks(mockTasks);
          setFilteredTasks(mockTasks);
        } else {
          setError('Failed to load tasks');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [session, filter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const createdTask = await api.createTask({
        title: newTask.title,
        description: newTask.description || undefined,
        completed: false,
      });

      setTasks([createdTask, ...tasks]);
      setNewTask({ title: '', description: '' });
      setError('');
    } catch (err: any) {
      console.error('Error creating task:', err);
      // Check if it's a network error
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))) {
        console.warn('Backend not accessible. Creating mock task for development.');
        // Create a mock task for development
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const mockTask = {
          id: newId,
          title: newTask.title,
          description: newTask.description || undefined,
          completed: false,
          user_id: session?.user?.id || 'mock-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTasks([mockTask, ...tasks]);
        setNewTask({ title: '', description: '' });
        setError('');
      } else {
        setError('Failed to create task');
      }
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = await api.updateTask(task.id, {
        completed: !task.completed,
      });

      const updatedTasks = tasks.map(t =>
        t.id === task.id ? updatedTask : t
      );

      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (err: any) {
      console.error('Error updating task:', err);
      // Check if it's a network error
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))) {
        console.warn('Backend not accessible. Updating mock task for development.');
        // Update the task locally for development
        const updatedTasks = tasks.map(t =>
          t.id === task.id ? { ...t, completed: !task.completed } : t
        );
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      } else {
        setError('Failed to update task');
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);

      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (err: any) {
      console.error('Error deleting task:', err);
      // Check if it's a network error
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))) {
        console.warn('Backend not accessible. Deleting mock task for development.');
        // Delete the task locally for development
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      } else {
        setError('Failed to delete task');
      }
    }
  };

  // Filter tasks based on status
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else if (filter === 'pending') {
      setFilteredTasks(tasks.filter(task => !task.completed));
    } else if (filter === 'completed') {
      setFilteredTasks(tasks.filter(task => task.completed));
    }
  }, [filter, tasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please log in to access the dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={signOut}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="mb-6">
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Task title"
                    maxLength={200}
                  />
                  <p className="mt-1 text-xs text-gray-500">Required. Max 200 characters.</p>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Task description (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'pending'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'completed'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No tasks found. Create your first task above!</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <li key={task.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task)}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <p
                            className={`ml-3 text-sm font-medium ${
                              task.completed ? 'text-gray-700 line-through' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {task.completed ? 'Completed' : 'Pending'}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-700">
                              {task.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
                            <p>
                              Created: {new Date(task.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}