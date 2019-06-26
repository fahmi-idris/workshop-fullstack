import React, { useContext, useState, useRef } from "react"
import {
  ListItem,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  TextField
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import styled, { css } from 'styled-components';

import { TodosContext } from "../index";

const TodoListItem = ({ done, task, index, divider }) => {
  const { dispatch } = useContext(TodosContext);
  const [editing, setEditing] = useState(false);

  const handleDoneChange = checked => {
    dispatch({
      type: "SET_DONE",
      done: checked,
      index
    });
  };

  const handleEditorBlur = task => {
    setEditing(false);
    dispatch({
      type: "SET_TEXT",
      task,
      index
    });
  };

  return (
    <ListItem divider={divider}>
    {!editing && (
      <Checkbox
        checked={done}
        onChange={handleDoneChange}
        disableRipple
      />
    )}
    {!editing ? <ListItemText primary={task} /> : <Editor task={task} onBlur={handleEditorBlur} />}
    <ListItemSecondaryAction>
    {!editing && (
      <IconButton aria-label="Edit Todo" onClick={() => {
        setEditing(true);
      }}>
        <Edit />
      </IconButton>
    )}
    </ListItemSecondaryAction>
  </ListItem>
  );
};

const Editor = ({ task, onBlur }) => {
  const [value, setValue] = useState(task);
  const input = useRef(null);

  const handleBlur = () => {
    onBlur(value);
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleKeyDown = e => {
    if(e.keyCode === 13){
      onBlur(value)
    }
  }

  return (
    <TextField
      placeholder="Edit Todo here"
      innerRef={input}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      fullWidth
    />
  );
};

const Checkbox = ({ checked, onChange }) => (
  <Box
    checked={checked}
    onClick={() => {
      onChange(!checked);
    }}
  />
);


const Box = styled.div`
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  padding: 0px;
  border-radius: 3px;
  margin-right: 15px;
  position: relative;
  cursor: pointer;

  ${props => props.checked ? css`
    background: #8c8a8a;
    color: #ffffff;
    border: 2px solid #8c8a8a;
    &:before {
      content: "✔";
      position: absolute;
      top: 3px;
      left: 5px;
      font-size: 13px;
    }
  ` : css`
    background: #ffffff;
    color: #ffffff;
    border: 2px solid #757575;
  `}
`;

export default TodoListItem;
