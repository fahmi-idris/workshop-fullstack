import React, { memo } from "react";
import styled from 'styled-components';
import { List, Paper } from "@material-ui/core";

import TodoListItem from "./TodoListItem";

const TodoList = memo(props => (
    <Paper style={{ margin: 16 }}>
      {props.items.length ? (
        <List style={{ overflow: "scroll" }}>
          {props.items.map((item, i) => (
            <TodoListItem
              {...item}
              index={i}
              key={i}
              divider={i !== props.items.length - 1}
            />
          ))}
        </List>
      ) : (
        <NoData>No task found</NoData>
      )}
    </Paper>
));

const NoData = styled.div`
  padding: 20px 10px;
  text-align: center;
`;

export default TodoList;