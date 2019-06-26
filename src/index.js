import React, { memo, useReducer, useEffect } from "react";
import ReactDOM from 'react-dom';
import ls from "local-storage";

import * as serviceWorker from './infrastructure/serviceWorker';

import Layout from "./components/Layout";
import Form from "./components/Form";
import TodoList from "./components/TodoList";

import './assets/css/style.css'

export const TodosContext = React.createContext([]);

const setTodoKeyByIndex = ({ todos, key, value, index }) => [
  ...todos.slice(0, index),
  { ...todos[index], [key]: value },
  ...todos.slice(index + 1)
];

const TodoApp = memo(props => {
  const [todos, dispatch] = useReducer((todos, action) => {
    switch (action.type) {
      case "ADD_TODO":
        return [
          { done: false, task: action.todo },
          ...todos
        ];
      case "SET_DONE":
        return setTodoKeyByIndex({
          todos,
          key: "done",
          value: action.done,
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

  const handleSubmit = todo => {
    dispatch({
      type: "ADD_TODO",
      todo
    });
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
