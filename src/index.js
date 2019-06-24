import React, { memo } from "react";
import ReactDOM from 'react-dom';

import * as serviceWorker from './infrastructure/serviceWorker';
import { useInputValue, useTodos } from "./infrastructure/hooks";

import Layout from "./components/Layout";
import Form from "./components/Form";
import TodoList from "./components/TodoList";

import './assets/css/style.css'

const TodoApp = memo(props => {
  const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
  const { todos, addTodo, checkTodo, removeTodo } = useTodos();

  const clearInputAndAddTodo = () => {
    clearInput();
    addTodo(inputValue);
  };

  console.dir(todos);

  return (
    <Layout>
      <Form
        inputValue={inputValue}
        onInputChange={changeInput}
        onButtonClick={clearInputAndAddTodo}
        onInputKeyPress={event => keyInput(event, clearInputAndAddTodo)}
      />
      <TodoList
        items={todos}
        onItemCheck={idx => checkTodo(idx)}
        onItemRemove={idx => removeTodo(idx)}
      />
    </Layout>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<TodoApp />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
