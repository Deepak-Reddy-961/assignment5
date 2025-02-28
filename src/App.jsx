import React, { useState, useEffect } from 'react';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (editIndex !== null) {
        saveEdit(editIndex); 
      } else {
        addTask(); 
      }
    }
  };

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('You must write something!');
      return;
    }
    const newTasks = [...tasks, { text: inputValue, completed: false }];
    setTasks(newTasks);
    saveTasks(newTasks);
    setInputValue('');
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const startEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editText } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
    setEditIndex(null);
    setEditText('');
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="todo-app">
        <div className="row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add your text"
          />
          <button onClick={addTask}>Add</button>
        </div>
        <ul id="list-container">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={task.completed ? 'checked' : ''}
              onClick={() => toggleTask(index)} 
            >
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                <span>{task.text}</span>
              )}
              <div className="icons">
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(index, task.text);
                  }}
                  className="edit-icon"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(index);
                  }}
                  className="delete-icon"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;