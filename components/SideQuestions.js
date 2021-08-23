import React from 'react';
import styles from '../styles/SideQuestions.module.css';

export default function SideQuestions({ tasks, onClickTask }) {
  const isActive = task => task.active;

  return (
    <div className={styles.sidebar}>
      <h3>Tasks</h3>

      <ul className={styles.ulSidebar}>
        {tasks.map(task => (
          <li
            onClick={() => onClickTask(task)}
            className={`${styles.list} ${isActive(task) ? styles.taskActive : ''}`}
            key={task.id}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
