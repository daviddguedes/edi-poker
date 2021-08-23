import React from "react";
import styles from '../styles/Main.module.css';

export default function BottomCards({ onCardClick }) {
  return (
    <div className={styles.bottomCards}>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(1)}>
        <p>1</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(2)}>
        <p>2</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(3)}>
        <p>3</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(5)}>
        <p>5</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(8)}>
        <p>8</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(13)}>
        <p>13</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(21)}>
        <p>21</p>
      </div>
      <div className={styles.bottomCardsItem} onClick={() => onCardClick(34)}>
        <p>34</p>
      </div>
    </div>
  );
}
