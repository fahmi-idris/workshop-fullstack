import React, { memo, useReducer, useEffect } from "react";
import ReactDOM from 'react-dom';
import ls from "local-storage";
import axios from 'axios';

import * as serviceWorker from './infrastructure/serviceWorker';

import Layout from "./components/Layout";
import Form from "./components/Form";
import TodoList from "./components/TodoList";

import './assets/css/style.css'

export const TodosContext = React.createContext([]);

const setTodoKeyByIndex = ({ todos, key, value, index, edited }) => [
  ...todos.slice(0, index),
  { ...todos[index], [key]: value, edited: edited },
  ...todos.slice(index + 1)
];

const TodoApp = memo(props => {
  const [todos, dispatch] = useReducer((todos, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return action.data.sort((a, b) => {
          if (a.done) return 1;
          if (b.done) return -1;
          return 0;
        });
      case "ADD_TODO":
        if (Array.isArray(action.data)) {
          return [...todos, ...action.data];
        }
        return [...todos, action.data];
      case "SET_DONE":
        return setTodoKeyByIndex({
          todos,
          key: "done",
          value: action.done,
          edited: true,
          index: action.index
        }).sort((a, b) => {
          if (a.done) return 1;
          if (b.done) return -1;
          return 0;
        });
      case "SET_TEXT":
        return setTodoKeyByIndex({
          todos,
          key: "task",
          edited: true,
          value: action.task,
          index: action.index
        });
      default:
        return todos;
    }
  }, ls.get("TODOS") || []);

  useEffect(
    () => {
      ls.set("TODOS", todos);
    },
    [todos]
  );

  useEffect(()  => {
    axios.get('http://localhost:8080/tasks').then((res) => {
      dispatch({
        type: "FETCH_REQUEST",
        data: res.data
      });
    })
  }, []);

  const handleSubmit = todo => {
    const isOnline = navigator.onLine ? true : false;
    const data = {
      done: false,
      task: todo
    };

    if (isOnline) {
      const offlineData = ls.get("TODOS").filter(item => !item._id);
      axios.post('http://localhost:8080/tasks', [ ...offlineData, data ]).then((res) => {
        dispatch({
          type: "ADD_TODO",
          data: res.data
        });
      }).catch(err => {
        alert('oppss something when wrong')
      })
    } else {
      dispatch({
        type: "ADD_TODO",
        data
      });
    }
  };

  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      <Layout>
        <Form onSubmit={handleSubmit} />
        <TodoList items={todos} />
      </Layout>
    </TodosContext.Provider>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<TodoApp />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
