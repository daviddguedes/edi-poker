import React, { useEffect, useState } from 'react';
import firebase from '../firebase/app';
import { useAuthState } from "react-firebase-hooks/auth";
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';

const db = firebase.firestore();

export default function Menu({ pokerId, onNewPlayer, onStart, btnText, onShowScores }) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        if (!user || loading) {
          setAdmin(false);
        }

        db
          .collection("pokers")
          .where("id", "==", pokerId)
          .where("userId", "==", user.uid)
          .onSnapshot(element => {
            element.docs.forEach(el => {
              if (el.data()) {
                setAdmin(true);
              }
            })
          });
      } catch (error) {
        setAdmin(false);
      }
    }
    check();
  }, [loading, user, pokerId]);

  return (
    <div className={styles.topMenu} id="menu">
      <p><Link href="/"><a style={{ textDecoration: 'none' }}>EDI POKER</a></Link></p>
      {router.pathname === '/poker/[id]' && <button className={styles.newBtn} onClick={onNewPlayer}>New Player</button>}
      {router.pathname === '/poker/[id]' && isAdmin && (
        <>
          <button className={styles.newBtnAction} onClick={onStart}>{btnText}</button>
          <button className={styles.newBtnAction} onClick={onShowScores}>Show Scores</button>
        </>
      )}
    </div>
  )
}
