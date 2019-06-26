import { useState, useEffect } from "react";
import axios from 'axios';

export const useInputValue = (initialValue = '') => {
  const [inputValue, setInputValue] = useState(initialValue);

  return {
    inputValue,
    changeInput: event => setInputValue(event.target.value),
    clearInput: () => setInputValue(''),
    keyInput: (event, callback) => {
      if (event.which === 13 || event.keyCode === 13) {
        callback(inputValue);
        return true;
      }

      return false;
    }
  };
};

export const useTodos = (initialValue = []) => {
  const [todos, setTodos] = useState(initialValue);
  async function fetchUrl() {
    const result = await axios(
      'https://private-46ace-todolist86.apiary-mock.com/tasks',
    );
    setTodos(result.data)
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  return {
    todos,
    addTodo: task => {
      if (task !== '') {
        setTodos(
          todos.concat({
            task
          })
        );
      }
    },
    checkTodo: idx => {
      setTodos(
        todos.map((todo, index) => {
          if (idx === index) {
            todo.done = !todo.done;
          }

          return todo;
        })
      );
    },
    removeTodo: idx => {
      setTodos(todos.filter((todo, index) => idx !== index));
    }
  };
};
