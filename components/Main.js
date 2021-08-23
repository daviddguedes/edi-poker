import React, { useState, useEffect } from 'react';
import router from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/app";
import styles from '../styles/Main.module.css';
import BottomCards from './BottomCards';

const db = firebase.firestore();

export default function Main({ title, players, player, activeTask, poker }) {
  const [userLogged, loading, error] = useAuthState(firebase.auth());
  const removePlayer = id => fetch(`/api/dp?player=${id}`);
  const showBottom = activeTask && activeTask.status === 'started';
  const [canRemove, setCanRemove] = useState(false);

  const handleCardClicked = async (value) => {
    const taskId = activeTask.id;
    const playerId = player?.id;
    const points = value;

    if (!playerId) {
      alert('Add a New Player.');
      return;
    }

    const taskSnaps = await db.collection('tasks').where('id', '==', taskId).get();
    taskSnaps.docChanges().forEach(async (task) => {
      const taskRef = task.doc.ref;
      const taskToUpdate = await taskRef.get();
      const scores = taskToUpdate.get("scores") ? taskToUpdate.get("scores") : {};
      scores[playerId] = points;
      taskRef.update({ scores });
    });
  }

  useEffect(() => {
    if (userLogged && activeTask) {
      setCanRemove(userLogged.uid === poker.userId);
    } else {
      setCanRemove(false);
    }
  }, [activeTask, poker, userLogged]);

  const handlePoints = (player) => {
    const playerId = player?.id;
    if (!activeTask) {
      return '?';
    }

    if (activeTask.scores && playerId) {
      if (!Object.keys(activeTask.scores).includes(playerId)) {
        return '?';
      }
      
      if (!activeTask.showScores) {
        return '...';
      }

      return activeTask.scores[playerId]
        ? activeTask.scores[playerId]
        : '?';
    }

    return '?';
  }

  const showCardsInBottom = () => {
    return showBottom && activeTask && players?.length && player;
  }

  return (
    <div className={styles.main}>
      <h3>POKER: {title}</h3>
      {activeTask && <p>Active Task: {activeTask.title} <span className={styles.status}>{activeTask.status}</span></p>}

      <div className={styles.containerPlayers}>
        {players.map((p) => (
          <div key={p.id} className={styles.card}>
            {canRemove && <div className={styles.cardClose}>
              <button onClick={() => removePlayer(p.id)}>x</button>
            </div>}
            <div className={styles.points}>
              {handlePoints(p)}
            </div>
            <div className={styles.userName}>{p.name}</div>
          </div>
        ))}
      </div>

      {showCardsInBottom() && <BottomCards onCardClick={handleCardClicked} />}
    </div>
  )
}
