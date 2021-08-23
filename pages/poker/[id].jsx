import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection
} from "react-firebase-hooks/firestore";
import { v4 as uuid } from "uuid";
import Modal from "react-modal";
import styles from "../../styles/Poker.module.css";
import firebase from "../../firebase/app";
import Main from "../../components/Main";
import SideQuestions from "../../components/SideQuestions";
import Menu from "../../components/Menu";
import { useRef } from "react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1a59e0",
    color: "aliceblue",
    display: "flex",
    flexDirection: "column",
    padding: "50px",
  },
};

const db = firebase.firestore();

export default function Poker({ id }) {
  const playerRef = useRef(null);
  const [userLogged, loading, error] = useAuthState(firebase.auth());
  const [poker, loadingPoker, errorPoker] = useCollection(
    db.collection("pokers").where("id", "==", id)
  );
  const [players, loadingPlayers, errorPlayers] = useCollection(
    db.collection("players").where("pokerId", "==", id)
  );
  const [tasks, loadingTasks, errorTasks] = useCollection(
    db.collection("tasks").where("pokerId", "==", id)
  );

  const [player, setPlayer] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (players && players.docs.length < 1) {
      setPlayer(null);
    }

    if (player) {
      if (!players.docs.some(pl => pl.data().id === player.id)) {
        setPlayer(null);
      }
    }

    if (userLogged && players) {
      players.docs.forEach((p) => {
        if (p.data().id === userLogged.uid) {
          setPlayer(p.data());
        }
      });
    }
  }, [players, userLogged]);

  useEffect(() => {
    return () => {
      if (player) {
        fetch(`/api/dp?player=${player.uid}`);
      }
    };
  }, [player]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const addPlayer = async () => {
    if (!playerRef || player) return;
    const pRef = await db.collection("players").add({
      id: userLogged ? userLogged.uid : uuid(),
      pokerId: id,
      name: playerRef.current.value,
    });

    const p = await pRef.get();
    setPlayer(p.data());
    closeModal();
  };

  const handleOnClickTask = async (task) => {
    const pokerUserId = await poker.docs[0].data().userId;
    if (!userLogged) return;
    if (userLogged && pokerUserId === userLogged.uid) {
      tasks.forEach(async (element) => {
        const ref = element.ref;
        const el = await element.data();
        ref.update({ active: el.id === task.id ? true : false });
      });
    }
  };

  const handleOnStart = () => {
    tasks.forEach(async (element) => {
      const ref = element.ref;
      const el = await element.data();
      if (!!el.active) {
        switch (el.status) {
          case "started":
            ref.update({ status: "stopped" });
            break;
          case "waiting":
            ref.update({ status: "started" });
            break;
          case "stopped":
            ref.update({ status: "waiting" });
          default:
            break;
        }
      }
    });
  };

  if (loadingPoker || loadingPlayers || loadingTasks) {
    return (
      <div className={styles.loading}>
        <h4>Loading...</h4>
      </div>
    );
  }

  const statusText = { waiting: "Start", started: "Stop", stopped: "Wait" };
  const taskActive = tasks.docs
    .map((snap) => snap.data())
    .find((el) => !!el.active);

  if (poker.size < 1) {
    return (
      <div className={styles.loading}>
        <h4>Poker not found...</h4>
      </div>
    );
  }

  const handleOnShowScores = async () => {
    const taskRef = await db.collection("tasks").where("id", "==", taskActive.id).get();
    taskRef.docs.forEach(task => {
      const ref = task.ref;
      ref.update({ showScores: !task.data().showScores });
    });
  }

  return (
    <div>
      <Menu
        pokerId={id}
        onNewPlayer={openModal}
        onStart={handleOnStart}
        btnText={taskActive && statusText[taskActive.status]}
        onShowScores={handleOnShowScores}
      />
      <div className={styles.main}>
        <Main
          title={poker.docs[0].data().title}
          players={players.docs.map((snap) => snap.data())}
          player={player}
          activeTask={taskActive}
          poker={poker.docs[0].data()}
        />
        <SideQuestions
          tasks={tasks.docs.map((snap) => snap.data())}
          onClickTask={handleOnClickTask}
        />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="EDI Poker"
          ariaHideApp={false}
        >
          <h3>What is your name?</h3>
          <input
            autoComplete="off"
            ref={playerRef}
            style={{ marginBottom: "5px", height: "30px" }}
            type="text"
          />
          <button className={styles.btnAddPlayer} onClick={addPlayer}>
            CONFIRM
          </button>
        </Modal>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = await firebase.firestore().collection("pokers").get();
  const data = [];
  paths.docs.forEach((doc) => {
    data.push({
      params: {
        id: doc.data().id,
      },
    });
  });

  return {
    paths: data,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
    revalidate: 1
  };
}
