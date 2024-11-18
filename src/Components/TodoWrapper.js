import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
// import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios'; // Import axios

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState
  ('completed'); // Add state for sorting

  // Fetch todos from Local Storage on initial render
  // useEffect(() => {
  //   // Retrieve todos from Local Storage on initial render
  //   const storedTodos = JSON.parse(localStorage.getItem('todos'));
  //   if (storedTodos) {
  //     setTodos(storedTodos); // Update state with stored todos
  //   }
  // }, []);

  // useEffect(() => {
  //   // Save todos to Local Storage only when there are actual todos
  //   if (todos.length > 0) {
  //     localStorage.setItem('todos', JSON.stringify(todos));
  //   } else {
  //     // If there are no todos, clear Local Storage to avoid empty string
  //     localStorage.removeItem('todos');
  //   }
  // }, [todos]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:1337/task/',); // Replace with your SailsJS backend URL (ensure CORS is configured)
        const data = await response.json(); // Parse the JSON response

        if (response.ok) { // Check for successful response (status code 200)
          setTodos(data);
        } else {
          // Handle errors gracefully, e.g., display an error message to the user
          console.error('Error fetching todos:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  
  
  
  const handleSort = () => {
    setSortBy(sortBy === 'completed' ? '!completed' : 'completed');
  };

  useEffect(() => {
    setTodos(
      todos.sort((a, b) =>
        sortBy === 'completed'
          ? a.completed - b.completed
          : b.completed - a.completed // Reverse order for completed tasks
      )
    );
  }, [todos, sortBy]);

  const addTodo = async (todo) => {
    try {
      const response = await fetch('http://localhost:1337/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: todo, completed: false }), // Send todo data to the server
      });
  
      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]); // Add the new todo to the local state
      } else {
        console.error('Failed to add todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  const togglecomplete = id => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo))
  }
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/task/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        console.error('Failed to delete todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // const editTodo = async (id, updatedTodo) => {
  //   try {
  //     const response = await fetch(`http://localhost:1337/task/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedTodo),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       // Update todos state with the edited todo
  //       setTodos(todos.map(todo => (todo.id === id ? data : todo)));
  //     } else {
  //       console.error('Error editing todo:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error editing todo:', error);
  //   }
  // };
  const editTodo = id => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo))
  }

 const editTask = (task, id) => {
  setTodos(
    todos.map(todo =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    )
  );
};
  return (
    <div className='TodoWrapper'>
      <h1> To do List</h1>
      <TodoForm addTodo={addTodo} />
      <button className='btn-sort' onClick={handleSort}>
        {/* FontAwesome icon for sorting */}
        <FontAwesomeIcon icon={faSort} />
        Sort
      </button>
      {todos.map((todo, index) => (
        todo.isEditing ? (
          <EditTodoForm key={index} editTodo={editTask} task={todo}/>
        ) : (
          <Todo key={index} task={todo} togglecomplete={togglecomplete} deleteTodo={deleteTodo} editTodo={editTodo}/>
        )
      ))}
    </div>
  );
  
}
