import firebase from '../firebase/app';
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from '../components/Auth';
import Menu from '../components/Menu';
import Form from '../components/Form';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [pokers, setPokers] = useState([]);

  const db = firebase.firestore();

  useEffect(() => {
    async function getPokers() {
      db
        .collection("pokers")
        .where("userId", "==", user.uid)
        .onSnapshot(snap => {
          const data = [];
          snap.forEach(doc => {
            data.push(doc.data());
          });
          setPokers(data);
        });
    }

    if (user) {
      getPokers();
    }
  }, [db, user]);

  const handleOnClickTask = (task) => {
    console.log(task);
  }

  function handleOnCreated() {
    console.log('Ok');
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h4>Loading...</h4>
      </div>
    )
  }

  if (!user && !loading) {
    return <Auth />
  }

  return (
    <div className={styles.mainPoker}>
      {user && (<>
        <Menu />
        <div className={styles.containerMain}>
          <div className={styles.leftColumn}>
            <h4>Create a Poker Session</h4>
            <Form class$={styles.formContainer} onCreated={handleOnCreated} />
          </div>

          <div className={styles.rightColumn}>
            {!pokers.length && (<h4>Loading...</h4>)}
            <ul className={styles.ulList}>
              {pokers.map(poker => (
                <li key={poker.id} className={styles.listPokers}>
                  <a href={`poker/${poker.id}`}>{poker.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>)}
    </div>
  )
}
