import React, { useState } from 'react';
import firebase from '../firebase/app';

export default function Form({ class$, onCreated }) {
  const [title, setTitle] = useState(null);
  const [file, setFile] = useState(null);

  function handleFile(event) {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setFile(i);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!title || !file) return;

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("title", title);
      body.append('userId', firebase.auth().currentUser.uid);
  
      const res = await fetch('/api/createPoker', {
        method: 'POST',
        body
      });

      if (res.status === 200) {
        onCreated();
      }
    } catch (error) {
      console.log("ERROR!", error.message);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} autoComplete="off" >
        <div className={class$}>
          <input autoComplete="off" onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder="Name of the poker session" />
          <input onChange={handleFile} type="file" name="file" accept=".csv" />
          <button>Submit</button>
        </div>
      </form>
    </>
  )
}
