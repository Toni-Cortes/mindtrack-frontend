import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function TaskList() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/${user.username}/tasks`);
        if (response.data && response.data.tasks) {
          const allTasks = response.data.tasks;
          const pendingTasks = allTasks.filter(task => !task.isCompleted);
          const completed = allTasks.filter(task => task.isCompleted);

          setTasks(pendingTasks);
          setCompletedTasks(completed);
        } else {
          console.error("No tasks found in the response data");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    if (user && user.username) {
      fetchTasks();
    } else {
      console.error("No user or username found");
    }
  }, [user]);

  // marking a task as completed or moving it back to pending
  async function handleTaskCompletion(taskId, isCompleted) {
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/tasks/${taskId}`, {
        isCompleted,
      });

      if (response.status === 200) {
        const updatedTask = response.data;

        if (isCompleted) {
          // remove task and add it to completed
          setTasks(tasks.filter(task => task._id !== taskId));
          setCompletedTasks([...completedTasks, updatedTask]);
        } else {
          // remove task and add it to pending
          setCompletedTasks(completedTasks.filter(task => task._id !== taskId));
          setTasks([...tasks, updatedTask]);
        }
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  }

  return (
    <div>
      <h2>To-Do List</h2>
      {tasks.length === 0 ? (
        <p>No pending tasks available</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className='task'>

              <input
                type="checkbox"
                onChange={() => handleTaskCompletion(task._id, true)}
                checked={task.isCompleted}
              />

              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>

            </li>
          ))}
        </ul>
      )}

      <h2>Completed Tasks (Last 5)</h2>
      {completedTasks.length === 0 ? (
        <p>No completed tasks available</p>
      ) : (
        <ul>
          {completedTasks.slice(-5).map((task) => (
            <li key={task._id}  className='task'>
              <input
                type="checkbox"
                onChange={() => handleTaskCompletion(task._id, false)}
                checked={task.isCompleted}
              />
              <div style={{ backgroundColor: 'rgb(28, 45, 59)'}}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
