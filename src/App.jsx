import React, { useState, useEffect } from "react";
// import keycloak from "./keycloak";
import './index.css'
import EditModal from './components/edit-modal';
import api from "./api";

export default function App() {
  // const [tasks, setTasks] = useState(["test", "list test"]);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // function addTask() {
  //    if(input.trim() !== ""){
  //           setTasks(t => [...t, input]);
  //           setInput("");
  //       }
  // }

  // function deleteTask(index) {
  //   setTasks(tasks.filter((_, i) => i !== index));
  // }
  

  function openEdit(task) {
    setEditIndex(task._id);
    setEditValue(task.task);
    setIsEdit(true);
  }

  // function saveEdit() {
  //   const updated = [...tasks];
  //   updated[editIndex] = editValue;
  //   setTasks(updated);
  //   setIsEdit(false);
  // }

  function saveEdit() {
    api.put(`/todolist/${editIndex}`, { task: editValue })
      .then(res => {
        setTasks(res.data);
        setIsEdit(false);
        setEditIndex(null);
        setEditValue("");
      })
      .catch(err => console.error(err));
  }

  function addTask() {
    if (input.trim() !== "") {
      api.post("/todolist", { task: input })
        .then(res => {
          setTasks(res.data);
          setInput("");
        })
        .catch(err => console.error(err));
    }
  }

  function deleteTask(_id) {
    api.delete(`/todolist/${_id}`)
      .then(res => setTasks(res.data));
  }

  useEffect(() => {
    api.get("/todolist")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  // useEffect(() =>{
  //   console.log("User info:", keycloak.tokenParsed);
  //   console.log("Token:", keycloak.token);
  // });

  return (
    <div className="todolist">
      <h1>TODO List</h1>
        <div>
          <input
          type="text"
          placeholder="Input new task"
          value={input}
          onChange={(e) => setInput(e.target.value) }/>

        <button
          className="add-button"
          onClick={addTask}>
          Add
        </button>
        </div>

         {isEdit && (
        <EditModal
          value={editValue}
          setValue={setEditValue}
          onSave={saveEdit}
          onClose={() => setIsEdit(false)}
        />
      )}

        <ol>
          {tasks.map((task) => 
            <li key={task._id}>
              <span className="text">{task.task}</span>
              <button
                className="edit-button"
                // should open modal to edit task
                onClick={() => openEdit(task)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
              
            </li>
          )}
        </ol>


    </div>
  )
}